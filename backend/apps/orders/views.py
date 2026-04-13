from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


from .models import CartItem
from .serializers import CartItemSerializer, AddToCartSerializer, UpdateCartSerializer
from apps.products.models import ProductVariant

# Create your views here.

class CartView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """get all items in user's cart"""
        cart_items = CartItem.objects.filter(user=request.user).select_related('variant', 'variant__product')
        
        serializer = CartItemSerializer(cart_items, many=True)
        
        # calculate cart totals
        cart_total = sum(item.item_total for item in cart_items)
        item_count = sum(item.quantity for item in cart_items)
        
        return Response({
            'items': serializer.data,
            'cart_total': str(cart_total),
            'item_count': item_count
        })

    def post(self, request):
        """add item to cart"""
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        variant_id = serializer.validated_data['variant_id']
        quantity = serializer.validated_data['quantity']
        
        variant = ProductVariant.objects.get(id=variant_id)
        
        # check if item already in cart
        cart_item, created = CartItem.objects.get_or_create(user=request.user, variant=variant, defaults={'quantity': quantity})
        if not created:
            # if already in cart, update quantity
            new_quantity = cart_item.quantity + quantity
            if new_quantity > variant.stock:
                return Response({'error': f"Only {variant.stock} items available in stock."}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = new_quantity
            cart_item.save()
            
        response_serializer = CartItemSerializer(cart_item)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class CartItemDetailViews(APIView):
    
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        """update cart item quantity"""
        cart_item = get_object_or_404(CartItem, pk=pk, user=request.user)
        
        serializer = UpdateCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        new_quantity = serializer.validated_data['quantity']
        
        # check stock
        if new_quantity > cart_item.variant.stock:
            return Response({'error': f"Only {cart_item.variant.stock} items available in stock."}, status=status.HTTP_400_BAD_REQUEST)
        
        cart_item.quantity = new_quantity
        cart_item.save()
        response_serializer = CartItemSerializer(cart_item)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, pk):
        """remove item from cart"""
        cart_item = get_object_or_404(CartItem, pk=pk, user=request.user)
        cart_item.delete()
        return Response({'message': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)


class ClearCartView(APIView):
    """delete all items from cart"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response({'message': 'Cart cleared'}, status=status.HTTP_204_NO_CONTENT)
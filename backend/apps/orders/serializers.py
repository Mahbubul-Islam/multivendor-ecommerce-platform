from rest_framework import serializers
from .models import CartItem
from apps.products.models import ProductVariant

class CartItemSerializer(serializers.ModelSerializer):
    """shows cart item details"""
    
    product_name = serializers.CharField(source='variant.product.name', read_only = True)
    product_slug = serializers.CharField(source='variant.product.slug', read_only = True)
    product_thumbnail = serializers.ImageField(source='variant.product.thumbnail', read_only = True)
    variant_size = serializers.CharField(source='variant.size', read_only = True)
    variant_color = serializers.CharField(source='variant.color', read_only = True)
    variant_price = serializers.DecimalField(source='variant.price', max_digits=10, decimal_places=2, read_only = True)
    variant_stock = serializers.IntegerField(source='variant.stock', read_only = True)
    item_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only = True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'variant', 'quantity', 'product_name', 'product_slug', 'product_thumbnail', 'variant_size', 'variant_color', 'variant_price', 'variant_stock', 'item_total', 'created_at']
        read_only_fields =['id', 'created_at']
        
class AddToCartSerializer(serializers.Serializer):
    """for adding items to cart"""
    
    variant_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default = 1)
    
    def validate_variant_id(self, value):
        """check if variant exists and has stock"""
        
        try:
            variant = ProductVariant.objects.get(id=value, is_active=True)
        except ProductVariant.DoesNotExist:
            raise serializers.ValidationError("Product variant not found.")
        if variant.stock <= 0:
            raise serializers.ValidationError("This item is out of stock.")
        return value
    
    def validate(self, data):
        """checks if requested quantity is available in stock"""
        variant = ProductVariant.objects.get(id=data['variant_id'])
        if data['quantity'] > variant.stock:
            raise serializers.ValidationError(f"Only {variant.stock} items available in stock.")
        return data


class UpdateCartSerializer(serializers.Serializer):
    """for updating cart item quantity"""
    quantity = serializers.IntegerField(min_value=1)
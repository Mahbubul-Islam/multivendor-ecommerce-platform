from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch, Avg, Count, Q

from .models import Product, Category, ProductVariant, Review
from .serializers import (
    CategorySerializer,
    CategoryTreeSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
    ReviewSerializer,
)
from .filters import ProductFilter
from apps.accounts.permissions import IsVendorOrReadOnly

# Create your views here.


# category ViewSet
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_queryset(self):
        # only return root categories for list view
        if self.action == "list":
            return self.queryset.filter(parent__isnull=True)
        return self.queryset

    def get_serializer_class(self):
        if self.action == "list":
            return CategoryTreeSerializer
        return CategorySerializer


# product ViewSet
class ProductViewSet(viewsets.ModelViewSet):
    queryset = (
        Product.objects.select_related("vendor", "vendor__user", "category")
        .prefetch_related("images", "variants", "reviews")
        .filter(is_active=True)
    )

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filter_class = ProductFilter
    search_fields = ["name", "description", "vendor__shop_name"]
    ordering_fields = ["created_at", "base_price", "name"]
    ordering = ["-created_at"]
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer

        elif self.action in ["create", "update", "partial_update"]:
            return ProductCreateUpdateSerializer

        return ProductDetailSerializer

    def get_permissions(self):
        if self.action in ["create"]:
            return [permissions.IsAuthenticated(), IsVendorOrReadOnly()]

        elif self.action in ["update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsVendorOrReadOnly()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # only vendor who owns the product can update
        if instance.vendor.user != request.user:
            return Response(
                {"error": "You don't have permission to edit this product."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # only vendor who owns the product can delete
        if instance.vendor.user != request.user:
            return Response(
                {"error": "You don't have permission to delete this product."},
                status=status.HTTP_403_FORBIDDEN,
            )
        # Soft delete
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Custom Actions
    @action(detail=False, methods=["get"])
    def featured(self, request):
        """Get featured products"""
        featured_products = self.get_queryset().filter(is_featured=True)[:12]
        serializer = ProductListSerializer(featured_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def trending(self, request):
        """Get trending products (most reviewed/sold)"""
        trending = (
            self.get_queryset()
            .annotate(review_count=Count("reviews"))
            .order_by("-review_count", "-created_at")[:12]
        )
        serializer = ProductListSerializer(trending, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def reviews(self, request, slug=None):
        """Get all reviews for a product"""
        product = self.get_object()
        reviews = product.reviews.all().order_by("-created_at")
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def add_review(self, request, slug=None):
        """Add a review to a product"""
        product = self.get_object()

        # Check if user already reviewed
        if Review.objects.filter(product=product, user=request.user).exists():
            return Response(
                {"error": "You have already reviewed this product."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import serializers
from django.db import transaction
from .models import Category, Product, ProductImage, ProductVariant, Review

from apps.accounts.serializers import UserSerializer

# Category Serializers


class CategorySerializer(serializers.ModelSerializer):
    """Basic category serializer"""

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "parent", "image", "description", "is_active"]
        read_only_fields = ["slug"]


class CategoryTreeSerializer(serializers.ModelSerializer):
    """Nested category serializer with children"""

    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "image", "children", "product_count"]

    def get_children(self, obj):
        if obj.children.exists():
            return CategoryTreeSerializer(
                obj.children.filter(is_active=True), many=True
            ).data
        return []

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


# Product Variant & Image Serializers


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "is_primary", "created_at"]
        read_only_fields = ["created_at"]


class ProductVariantSerializer(serializers.ModelSerializer):
    in_stock = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "size",
            "color",
            "sku",
            "price",
            "stock",
            "is_active",
            "in_stock",
        ]

    def get_in_stock(self, obj):
        return obj.stock > 0


# Product Serializers


class ProductListSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source="vendor.username", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    current_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    discount_percentage = serializers.IntegerField(read_only=True)
    average_rating = serializers.DecimalField(
        max_digits=3, decimal_places=2, read_only=True
    )
    total_reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "thumbnail",
            "base_price",
            "discount_price",
            "current_price",
            "discount_percentage",
            "vendor_name",
            "category_name",
            "average_rating",
            "total_reviews",
            "is_featured",
            "in_stock",
            "created_at",
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    vendor = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    current_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    discount_percentage = serializers.IntegerField(read_only=True)
    average_rating = serializers.DecimalField(
        max_digits=3, decimal_places=2, read_only=True
    )
    total_reviews = serializers.IntegerField(read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "vendor",
            "category",
            "name",
            "slug",
            "description",
            "base_price",
            "discount_price",
            "current_price",
            "discount_percentage",
            "thumbnail",
            "images",
            "variants",
            "is_active",
            "is_featured",
            "average_rating",
            "total_reviews",
            "in_stock",
            "created_at",
            "updated_at",
        ]

    def get_vendor(self, obj):
        return {
            "id": obj.vendor.id,
            "shop_name": obj.vendor.shop_name,
            "shop_slug": obj.vendor.shop_slug,
            "is_verified": obj.vendor.is_verified,
        }


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, required=False)
    variants = ProductVariantSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            "category",
            "name",
            "description",
            "base_price",
            "discount_price",
            "thumbnail",
            "is_active",
            "is_featured",
            "images",
            "variants",
        ]

    def validate(self, attrs):
        # validate discount price
        if attrs.get("discount_price"):
            if attrs["discount_price"] >= attrs["base_price"]:
                raise serializers.ValidationError(
                    "Discount price must be less than base price."
                )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        variants_data = validated_data.pop("variants", [])

        # get vendor from request
        vendor = self.context["request"].user.vendor_profile
        product = Product.objects.create(vendor=vendor, **validated_data)

        # create images
        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)

        # create variants
        for variant_data in variants_data:
            ProductVariant.objects.create(product=product, **variant_data)
        return product

    @transaction.atomic
    def update(self, instance, validated_data):
        images_data = validated_data.pop("images", None)
        variants_data = validated_data.pop("variants", None)

        # update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # update images if provided
        if images_data is not None:
            instance.images.all().delete()  # delete old images
            for image_data in images_data:
                ProductImage.objects.create(product=instance, **image_data)

        # update variants if provided
        if variants_data is not None:
            instance.variants.all().delete()  # delete old variants
            for variant_data in variants_data:
                ProductVariant.objects.create(product=instance, **variant_data)

        return instance


# Review Serializer


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "user",
            "user_name",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "created_at", "updated_at"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

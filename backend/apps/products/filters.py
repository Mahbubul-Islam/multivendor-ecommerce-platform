import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):

    # price range filters
    min_price = django_filters.NumberFilter(
        field_name="variants__price", lookup_expr="gte"
    )
    max_price = django_filters.NumberFilter(
        field_name="variants__price", lookup_expr="lte"
    )

    # category
    category = django_filters.NumberFilter(field_name="category__id")
    category_slug = django_filters.CharFilter(field_name="category__slug")

    # vendor
    vendor = django_filters.NumberFilter(field_name="vendor__id")
    vendor_slug = django_filters.CharFilter(field_name="vendor__shop_slug")

    # flags
    is_featured = django_filters.BooleanFilter()
    on_sale = django_filters.BooleanFilter(method="filter_on_sale", label="On Sale")
    in_stock = django_filters.BooleanFilter(method="filter_in_stock", label="In Stock")

    class Meta:
        model = Product
        fields = ["category", "vendor", "is_featured", "is_active"]

    def filter_on_sale(self, queryset, name, value):
        if value:
            return queryset.filter(discount_price__isnull=False)
        return queryset

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(
                variants__stock__gt=0, variants__is_active=True
            ).distinct()
        return queryset

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from apps.accounts.models import User, VendorProfile
from apps.products.models import Category, Product
from django.utils.text import slugify

# Create a vendor user
try:
    vendor_user = User.objects.get(email="vendor@shopbd.com")
    print(f"Vendor user already exists: {vendor_user.email}")
except:
    vendor_user = User.objects.create_user(
        email="vendor@shopbd.com",
        username="shopbd_vendor",
        first_name="BD",
        last_name="Shop",
        password="password123",
        role=User.Role.VENDOR,
    )
    print(f"Created vendor user: {vendor_user.email}")

# Update vendor profile
vendor_profile = vendor_user.vendor_profile
vendor_profile.shop_name = "BD Electronics"
vendor_profile.shop_slug = slugify("BD Electronics")
vendor_profile.is_verified = True
vendor_profile.save()
print(f"Updated vendor profile: {vendor_profile.shop_name}")

# Create categories
categories = []
cat_names = ["Electronics", "Clothing", "Books", "Home & Garden"]
for cat_name in cat_names:
    cat, created = Category.objects.get_or_create(
        name=cat_name, defaults={"slug": slugify(cat_name), "is_active": True}
    )
    # Ensure category is active
    if not cat.is_active:
        cat.is_active = True
        cat.save()
    categories.append(cat)
    if created:
        print(f"Created category: {cat_name}")
    else:
        print(f"Category already exists: {cat_name}")

# Create sample products
products_data = [
    {
        "name": "Smartphone Pro Max",
        "category_idx": 0,
        "base_price": 45000,
        "discount_price": 39999,
    },
    {
        "name": "Wireless Headphones",
        "category_idx": 0,
        "base_price": 8000,
        "discount_price": 5999,
    },
    {
        "name": "Cotton T-Shirt",
        "category_idx": 1,
        "base_price": 1500,
        "discount_price": None,
    },
    {
        "name": "Python Programming Book",
        "category_idx": 2,
        "base_price": 2500,
        "discount_price": 1999,
    },
    {
        "name": "Desk Chair",
        "category_idx": 3,
        "base_price": 12000,
        "discount_price": 9999,
    },
]

for prod_data in products_data:
    try:
        product = Product.objects.get(name=prod_data["name"])
        print(f"Product already exists: {product.name}")
    except:
        product = Product.objects.create(
            vendor=vendor_profile,
            category=categories[prod_data["category_idx"]],
            name=prod_data["name"],
            slug=slugify(prod_data["name"]),
            description=f"High quality {prod_data['name'].lower()}. Great value for money!",
            base_price=prod_data["base_price"],
            discount_price=prod_data["discount_price"],
            thumbnail="products/thumbnails/default.jpg",
            is_active=True,
            is_featured=True,
        )
        print(f"Created product: {product.name}")

print("Test data creation complete!")

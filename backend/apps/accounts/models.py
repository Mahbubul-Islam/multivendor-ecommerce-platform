from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.text import slugify


class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = "customer", "Customer"
        VENDOR = "vendor", "Vendor"
        ADMIN = "admin", "Admin"

    email = models.EmailField(unique=True)

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.CUSTOMER)

    phone = models.CharField(max_length=15, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # For login email is used
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class CustomerProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="customer_profile"
    )
    shipping_address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return f"Customer: {self.user.email}"


class VendorProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="vendor_profile"
    )
    shop_name = models.CharField(max_length=200)
    shop_slug = models.SlugField(unique=True, blank=True, editable=False)
    shop_description = models.TextField(blank=True)
    logo = models.ImageField(upload_to="vendor_logos/", blank=True, null=True)
    banner = models.ImageField(upload_to="vendor_banners/", blank=True, null=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def _build_unique_slug(self):
        base_value = self.shop_slug or self.shop_name
        base_slug = slugify(base_value) or "shop"
        slug = base_slug
        suffix = 2

        while VendorProfile.objects.filter(shop_slug=slug).exclude(pk=self.pk).exists():
            slug = f"{base_slug}-{suffix}"
            suffix += 1

        return slug

    def save(self, *args, **kwargs):
        if not self.shop_slug:
            self.shop_slug = self._build_unique_slug()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.shop_name

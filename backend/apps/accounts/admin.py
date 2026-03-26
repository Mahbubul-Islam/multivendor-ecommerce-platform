from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, CustomerProfile, VendorProfile


# Register your models here.
class CustomerProfileInline(admin.StackedInline):
    model = CustomerProfile
    can_delete = False


class VendorProfileInline(admin.StackedInline):
    model = VendorProfile
    can_delete = False
    prepopulated_fields = {"shop_slug": ("shop_name",)}


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "username", "role", "is_active", "created_at"]
    list_filter = ["role", "is_active", "is_email_verified"]
    search_fields = ["email", "username", "first_name", "last_name"]
    ordering = ["-created_at"]

    # Add role and phone to the admin form
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Extra Info", {"fields": ("role", "phone", "avatar", "is_email_verified")}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (
            "Extra Info",
            {"fields": ("email", "first_name", "last_name", "role", "phone")},
        ),
    )

    def get_inlines(self, request, obj=None):

        if obj:

            if obj.role == "customer":
                return [CustomerProfileInline]

            elif obj.role == "vendor":
                return [VendorProfileInline]

        return []


@admin.register(VendorProfile)
class VendorProfileAdmin(admin.ModelAdmin):
    list_display = ["shop_name", "shop_slug", "user", "is_verified", "created_at"]
    list_filter = ["is_verified"]
    search_fields = ["shop_name"]
    prepopulated_fields = {"shop_slug": ("shop_name",)}

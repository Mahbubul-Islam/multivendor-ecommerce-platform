from django.db import models
from django.conf import settings

# Create your models here.
class CartItem(models.Model):
    """Shopping cart item"""
    
    user = models.ForeignKey( settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart_items")
    variant = models.ForeignKey("products.ProductVariant", on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ("user", "variant")
        ordering = ["-created_at"]
        
    def __str__(self):
        return f"{self.user.email} - {self.variant} x {self.quantity}"
    
    @property
    def product_name(self):
        return self.variant.product.name
    
    @property
    def product_thumbnail(self):
        return self.variant.product.thumbnail.url if self.variant.product.thumbnail else None
    
    @property
    def item_total(self):
        return self.variant.price * self.quantity

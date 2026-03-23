from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, CustomerProfile, VendorProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    
    if created:
        
        if instance.role == User.Role.CUSTOMER:
            CustomerProfile.objects.create(user=instance)
            
        elif instance.role == User.Role.VENDOR:
            VendorProfile.objects.create(
                user=instance,
                shop_name=f"{instance.first_name}'s Shop",
                shop_slug=instance.username
            )
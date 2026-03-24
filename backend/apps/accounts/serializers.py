from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import CustomerProfile, VendorProfile

User = get_user_model()

class CustomerRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name','last_name', 'phone', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            
            raise serializers.ValidationError({"password": "Passwords don't match."})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data,role=User.Role.CUSTOMER)
        return user
    
class VendorRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)
    shop_name = serializers.CharField(max_length=200)

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name','phone', 'password', 'password2', 'shop_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            
            raise serializers.ValidationError({"password": "Passwords don't match."})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        shop_name = validated_data.pop('shop_name')
        user = User.objects.create_user(**validated_data,role=User.Role.VENDOR)
        
        vendor_profile = user.vendor_profile
        vendor_profile.shop_name = shop_name
        vendor_profile.shop_slug = ""
        vendor_profile.save()
        return user
    
    
    
class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ['shipping_address', 'city', 'postal_code']
        
        
        
        
class VendorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorProfile
        fields = ['shop_name', 'shop_slug', 'shop_description', 'logo', 'banner', 'address', 'city', 'is_verified']
        read_only_fields = ['shop_slug', 'is_verified']
        
        
        
# after login return user data
class UserSerializer(serializers.ModelSerializer):
    
    customer_profile = CustomerProfileSerializer(read_only=True)
    vendor_profile = VendorProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'role', 'phone', 'avatar', 'is_email_verified', 'customer_profile', 'vendor_profile']
        read_only_fields = ['email', 'role']

    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password]
    )

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
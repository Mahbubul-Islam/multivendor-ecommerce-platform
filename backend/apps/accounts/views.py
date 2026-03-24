from rest_framework.response import Response
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .serializers import CustomerRegistrationSerializer, VendorRegistrationSerializer, UserSerializer, ChangePasswordSerializer

# Create your views here.
User = get_user_model()

# Custom JWT
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer): # TokenObtainPairSerializer -> handles login and token
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user) # get_token() -> customize JWT payload
        # Add custom claims
        token['email'] = user.email
        token['role'] = user.role
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs) # validate() -> customize API response
        # Add user data to response
        data['user'] = UserSerializer(self.user).data
        return data
    
    
class CustomTokenObtainPairView(TokenObtainPairView):
    
    serializer_class = CustomTokenObtainPairSerializer
    

# Registration View
# Register a new customer
class CustomerRegistrationView(generics.CreateAPIView):
    
    serializer_class = CustomerRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    # POST
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
    # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
                'message': 'Customer registered successfully!',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
# Register a new vendor        
class VendorRegistrationView(generics.CreateAPIView):
    
    serializer_class = VendorRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Vendor registered successfully!',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
# User Profile View

class UserProfileView(generics.RetrieveUpdateAPIView):
    
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    
class ChangePasswordView(generics.UpdateAPIView):
    
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)

        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK
        )
        
# Logout View (blacklist refresh token)

class LogoutView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Logged out successfully."},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"error": "Invalid token."},
                status=status.HTTP_400_BAD_REQUEST
            )
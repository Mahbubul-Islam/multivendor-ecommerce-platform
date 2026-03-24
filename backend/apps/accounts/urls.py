from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # auth
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain'),
    path('auth/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/customer/', views.CustomerRegistrationView.as_view(), name='customer_register'),
    path('auth/register/vendor/', views.VendorRegistrationView.as_view(), name='vendor_register'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/change-password/', views.ChangePasswordView.as_view(), name='change_pass'),
    
    # Profile
    path('auth/profile/', views.UserProfileView.as_view(), name='user_profile'),
]

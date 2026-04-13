from django.urls import path
from . import views

urlpatterns = [
    # Cart
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/<int:pk>/', views.CartItemDetailViews.as_view(), name='cart-item'),
    path('cart/clear/', views.ClearCartView.as_view(), name='cart-clear'),
]
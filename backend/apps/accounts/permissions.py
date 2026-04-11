from rest_framework import permissions

class IsVendorOrReadOnly(permissions.BasePermission):
    """
    custom permission to only allow vendors to create products
    """

    def has_permission(self, request, view):
        # read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to vendors.
        return (request.user and request.user.is_authenticated and request.user.role == 'vendor')
    

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    owners can edit or delete
    """

    def has_object_permission(self, request, view, obj):
        # read permissions for everyone
        if request.method in permissions.SAFE_METHODS:
            return True

        # write permissions only to the owner
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'vendor'):
            return obj.vendor.user == request.user
        return False
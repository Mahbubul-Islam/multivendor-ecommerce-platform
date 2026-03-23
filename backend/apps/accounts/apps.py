from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.accounts'          # CHANGE THIS (add apps. prefix)
    label = 'accounts'

    # def ready(self):
        # import apps.accounts.signals  # I'll create this on Day 2 
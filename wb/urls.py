from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(("chat_feature.urls", 'chat_feature'), namespace='chat_feature')),
]

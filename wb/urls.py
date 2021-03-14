from django import contrib
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include("chat_feature.urls")),
    path('account/',include("django.contrib.auth.urls"))
]

from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.contrib.auth import views as auth_views
app_name = 'chat_feature'

urlpatterns = [
    path("home/", views.index, name="home"),
    path('chat/', views.chat_index, name='chat_index'),
    path('chat/<str:room_name>/', views.room, name='room'),
]

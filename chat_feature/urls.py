from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = 'chat_feature'

urlpatterns = [
    path("", views.index, name="home"),
    path("home/", views.index, name=""),
    path('sign_up/', views.sign_up, name="sign-up"),
    path('login/', views.log_in, name="login"),
    path('chat/', views.chatIndex, name='chatIndex'),
    path('chat/<str:room_name>/', views.room, name='room'),
    path('logout/', views.logout_view, name='logout'),
]
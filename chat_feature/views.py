from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, "chat_feature/index.html")

def chat_index(request):
    return render(request, 'chat_feature/chat_index.html')


def room(request, room_name):
    return render(request, 'chat_feature/chat_room.html', {
        'room_name': room_name
    })

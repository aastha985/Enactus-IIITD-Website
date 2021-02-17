from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.contrib import messages

# Create your views here.
def index(request):
    return render(request, "chat_feature/index.html")

def log_in(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password1']
        #print(username)
        user = authenticate(request, username = username, password = password)
        if user is not None:
            login(request, user)
            return redirect('chat_feature:home')
        else:
            messages.error(request, 'Invalid Credentials')
    return render(request, 'chat_feature/login.html')

def sign_up(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password1']
        confirm_password = request.POST['password2']

        if password == confirm_password:
            if User.objects.filter(username=username).exists():
                messages.error(request, 'Username taken!')
                return redirect('chat_feature:sign-up')
            else:
                user = User.objects.create_user(username = username, password = password)
                user.save()
                #print("user registered")
                login(request, user)
                return redirect('chat_feature:home')
        else:
            messages.error(request, 'Passwords do not match!')
            return redirect("chat_feature:sign-up")

    return render(request, "chat_feature/sign_up.html")
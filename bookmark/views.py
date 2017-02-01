from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.contrib import messages
from .models import Bookmark


def login(request):
    """
    Handle authentication
    :param request:
    :return:
    """
    if request.user.is_authenticated:
        return redirect('dashboard')
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = auth.authenticate(username=username, password=password)
        if user:
            auth.login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, 'Username/Password is not valid!')
            return redirect('/')
    else:
        return render(request, 'login.html')


@login_required
def dashboard(request):
    bookmarks = Bookmark.objects.order_by('-id')
    return render(request, 'dashboard.html', {'bookmarks': bookmarks})
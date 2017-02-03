from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.contrib import messages
from .models import Bookmark
from .forms import BookmarkForm
from django.http import JsonResponse
from urllib.request import urlopen
from .utils import Title
from django.views.decorators.csrf import csrf_exempt


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
    """
    Returns whole bookmark data
    :param request:
    :return:
    """
    bookmarks = Bookmark.objects.order_by('-id')
    return render(request, 'dashboard.html', {'bookmarks': bookmarks})


@login_required
def form(request):
    if request.method == 'POST':
        frm = BookmarkForm(request.POST)
        if frm.is_valid():
            frm.save()
            return JsonResponse(frm, safe=False)
    return render(request, 'form.html')


@login_required
@csrf_exempt
def title(request):
    if request.method == 'POST':
        # html_string = str(urlopen('url').read())
        # parser = Title.TitleParser()
        # parser.feed(html_string)
        # print(parser.title)
        print("called")
        return request.POST.get('title')

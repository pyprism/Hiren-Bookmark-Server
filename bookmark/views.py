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
from taggit.models import Tag
from django.core import serializers


def login(request):
    """
    Handle authentication
    :param request:
    :return:
    """
    if request.user.is_authenticated:
        return redirect('secret')
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = auth.authenticate(username=username, password=password)
        if user:
            auth.login(request, user)
            return redirect('secret')
        else:
            messages.error(request, 'Username/Password is not valid!')
            return redirect('/')
    else:
        return render(request, 'login.html')


@login_required
def secret(request):
    return render(request, 'secret.html')


@login_required
def dashboard(request):
    """
    Returns whole bookmark data
    :param request:
    :return:
    """
    bookmarks = Bookmark.objects.order_by('-id')
    return render(request, 'dashboard.html', {'bookmarks': bookmarks})


@csrf_exempt
@login_required
def form(request):
    if request.method == 'POST':
        frm = BookmarkForm(request.POST)
        if frm.is_valid():
            frm.save()
            return JsonResponse({'status': 'created'})
        else:
            return JsonResponse({'error': frm.errors})
    return render(request, 'form.html')


@login_required
@csrf_exempt
def title(request):
    """
    Return url's title
    :param request:
    :return:
    """
    if request.method == 'POST':
        try:
            html_string = str(urlopen(str(request.POST.get('url'))).read())
        except ValueError:
            return JsonResponse({'error': 'Not a valid url'})
        parser = Title.TitleParser()
        parser.feed(html_string)
        return JsonResponse({'title': parser.title})


@login_required
def tags(request):
    tags = Tag.objects.all().values('name')
    # return JsonResponse(tags, safe=False)
    return JsonResponse(serializers.serialize('json', tags), safe=False)
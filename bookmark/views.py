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
from django.shortcuts import get_object_or_404


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
    just returns the f@%king template
    :param request:
    :return:
    """
    return render(request, 'dashboard.html')


@login_required
def dashboard_ajax(request):
    """
    view dashboard's ajax
    :param request:
    :return:
    """
    bookmarks = Bookmark.objects.all()
    bunny = []
    for i in bookmarks:
        hiren = {}
        hiren['id'] = i.pk
        hiren['title'] = i.title
        hiren['url'] = i.url
        hiren['iv'] = i.iv
        hiren['salt'] = i.salt
        hiren['iteration'] = i.iteration
        hiren['created_at'] = i.created_at
        bunny.append(hiren)
    return JsonResponse(bunny, safe=False)


@csrf_exempt
@login_required
def form(request):
    """
    Handle form input
    :param request:
    :return:
    """
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
    """
    Returns all tag names
    :param request:
    :return:
    """
    tags = Tag.objects.all().values('name')
    nisha = []
    for i in tags:
        if i['name'] == '[' or i['name'] == ']':  # for jquery massacre !
            pass
        else:
            nisha.append(i['name'])
    return JsonResponse(nisha, safe=False)


@login_required
def tag_cloud(request):
    """
    Generate tag cloud
    :param request:
    :return:
    """
    if request.content_type == 'application/json':
        tags = Tag.objects.all().values('name')
        clouds = []
        for tag in tags:
            cloud = {}
            if not (tag['name'] == '[' or tag['name'] == ']'):
                bookmark = Bookmark.objects.filter(tags__name__in=[tag['name']]).count()
                cloud['text'] = tag['name']
                cloud['weight'] = bookmark
                cloud['link'] = '/tags/' + tag['name'] + '/'
                clouds.append(cloud)
        return JsonResponse(clouds, safe=False)
    return render(request, 'tag_cloud.html')


@login_required
def bookmark_by_tag(request, name=None):
    """
    Returns bookmarks by name
    :param request:
    :param name:
    :return:
    """
    if request.content_type == 'application/json':
        bookmark = Bookmark.objects.filter(tags__name__in=[name])
        bunny = []
        for i in bookmark:
            hiren = {}
            hiren['id'] = i.pk
            hiren['title'] = i.title
            hiren['url'] = i.url
            hiren['iv'] = i.iv
            hiren['salt'] = i.salt
            hiren['iteration'] = i.iteration
            hiren['created_at'] = i.created_at
            bunny.append(hiren)
        return JsonResponse(bunny, safe=False)
    return render(request, 'tag.html', {'tag': name})


@login_required
def bookmark_readonly(request, pk=None):
    """
    Serve bookmark for readonly view
    :param request:
    :param pk:
    :return:
    """
    bookmark = get_object_or_404(Bookmark, pk=pk)
    return render(request, 'bookmark_readonly.html', {'bookmark': bookmark})

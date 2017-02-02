from django.conf.urls import url, include
from bookmark import views
from django.contrib.auth import views as auth

urlpatterns = [
    url(r'^$', views.login, name='login'),
    url(r'^logout/$', auth.logout, {'next_page': '/'}, name="logout"),
    url(r'^dashboard/', views.dashboard, name='dashboard'),
]

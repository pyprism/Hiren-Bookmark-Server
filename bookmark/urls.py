from django.conf.urls import url, include
from bookmark import views

urlpatterns = [
    url(r'^', views.login, name='login'),
    url(r'dashboard/$', views.dashboard, name='dashboard'),
]
from django.conf.urls import url
from bookmark import views
from django.contrib.auth import views as auth

urlpatterns = [
    url(r'^$', views.login, name='login'),
    url(r'^secret/$', views.secret, name='secret'),
    url(r'^logout/$', auth.logout, {'next_page': '/'}, name="logout"),
    url(r'^dashboard/$', views.dashboard, name='dashboard'),
    url(r'^dashboard_ajax/$', views.dashboard_ajax),
    url(r'^form/$', views.form, name='form'),
    url(r'^title/$', views.title),
    url(r'^tags_ajax/$', views.tags),
    url(r'^tags/$', views.tag_cloud, name='tags'),
]

from django.conf.urls import url
from bookmark import views
from django.contrib.auth import views as auth

urlpatterns = [
    url(r'^$', views.login, name='login'),
    url(r'^secret/$', views.secret, name='secret'),
    url(r'^logout/$', auth.logout, {'next_page': '/'}, name="logout"),
    url(r'^dashboard/(?P<pk>[^\.]+)/edit/$', views.bookmark_edit),
    url(r'^dashboard/(?P<pk>[^\.]+)/delete/$', views.delete),
    url(r'^dashboard/(?P<pk>[^\.]+)/$', views.bookmark_readonly),
    url(r'^dashboard/$', views.dashboard, name='dashboard'),
    url(r'^dashboard_ajax/$', views.dashboard_ajax),
    url(r'^form/$', views.form, name='form'),
    url(r'^title/$', views.title),
    url(r'^tags_ajax/$', views.tags),
    url(r'^tags/(?P<name>\w+)/$', views.bookmark_by_tag),
    url(r'^tags/$', views.tag_cloud, name='tags')
]

from django.urls import path
from bookmark import views

urlpatterns = [
    path('', views.login, name='login'),
    path('secret/', views.secret, name='secret'),
    path('logout/', views.logout, name="logout"),
    path('dashboard/<int:pk>/edit/', views.bookmark_edit),
    path('dashboard/<int:pk>/delete/', views.delete),
    path('dashboard/<int:pk>/', views.bookmark_readonly),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard_ajax/', views.dashboard_ajax),
    path('form/', views.form, name='form'),
    path('title/', views.title),
    path('tags_ajax/', views.tags),
    path('tags/<str:name>/', views.bookmark_by_tag),
    path('tags/', views.tag_cloud, name='tags')
]

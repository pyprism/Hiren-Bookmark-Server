from django.db import models
from taggit.managers import TaggableManager


class Browser(models.Model):
    profile_name = models.CharField(max_length=400)
    browser_type = (
        ('fr', 'Firefox'),
        ('ch', 'Chrome'),
        ('op', 'Opera'),
        ('ot', 'Other'),
    )
    browser_name = models.CharField(choices=browser_type, max_length=2)
    device_name = models.CharField(max_length=400)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Bookmark(models.Model):
    browser = models.ForeignKey(Browser, on_delete=models.CASCADE, null=True, blank=True)
    title = models.TextField()
    url = models.TextField()
    iv = models.TextField()
    salt = models.TextField()
    iteration = models.IntegerField(default=1500)
    tags = TaggableManager()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

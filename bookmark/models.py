from django.db import models
from taggit.managers import TaggableManager


class Bookmark(models.Model):
    title = models.TextField()
    url = models.TextField()
    iv = models.TextField()
    salt = models.TextField()
    iteration = models.IntegerField(default=1500)
    tags = TaggableManager()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

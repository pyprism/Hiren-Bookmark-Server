from django.forms import ModelForm
from .models import Bookmark


class BookmarkForm(ModelForm):
    class Meta:
        model = Bookmark
        fields = '__all__'


class BookmarkFormEdit(ModelForm):
    class Meta:
        model = Bookmark
        exclude = ('tags',)

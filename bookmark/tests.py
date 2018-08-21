from django.urls import resolve
from django.test import TestCase, TransactionTestCase
from django.test import Client
from .models import Bookmark
from . import views
from freezegun import freeze_time
from base.models import Account


class LoginViewTest(TestCase):
    """
    Test for login view
    """

    def setUp(self):
        self.c = Client()
        self.user = Account.objects.create_user(username='hiren', password='bunny')

    def test_login_url_resolves_to_login_view(self):
        found = resolve('/')
        self.assertEqual(found.func, views.login)

    def test_auth_works(self):
        respond = self.c.post('/', {'username': 'hiren', 'password': 'bunny'})
        self.assertRedirects(respond, '/secret/')

    def test_redirect_works_for_bad_auth(self):
        respond = self.c.post('/', {'username': 'hiren', 'password': 'bad pass'})
        self.assertRedirects(respond, '/')

    def test_redirect_for_unauthenticated_user_works(self):
        response = self.c.get('/dashboard/')
        self.assertRedirects(response, '/?next=/dashboard/')

    def test_authenticated_user_redirect_to_the_app(self):
        self.c.login(username='hiren', password='bunny')
        response = self.c.get('/', follow=True)
        self.assertRedirects(response, '/secret/')

    def test_view_returns_correct_template(self):
        response = self.c.get('/')
        self.assertTemplateUsed(response, 'login.html')


class SecretViewTest(TestCase):

    def setUp(self):
        self.c = Client()
        self.user = Account.objects.create_user(username='hiren', password='bunny')

    def test_secret_view_returns_correct_template(self):
        self.c.login(username='hiren', password='bunny')
        response = self.c.get('/secret/')
        self.assertTemplateUsed(response, 'secret.html')

    def test_login_url_resolves_to_login_view(self):
        found = resolve('/secret/')
        self.assertEqual(found.func, views.secret)


class DashboardViewTest(TestCase):

    def setUp(self):
        self.c = Client()
        self.user = Account.objects.create_user(username='hiren', password='bunny')

    def test_secret_view_returns_correct_template(self):
        self.c.login(username='hiren', password='bunny')
        response = self.c.get('/dashboard/')
        self.assertTemplateUsed(response, 'dashboard.html')

    def test_url_resolves_to_correct_view(self):
        found = resolve('/dashboard/')
        self.assertEqual(found.func, views.dashboard)


class DashboardAJaxViewTest(TestCase):

    @freeze_time('05/12/2012')
    def setUp(self):
        self.c = Client()
        self.user = Account.objects.create_user(username='hiren', password='bunny')
        Bookmark.objects.create(title="title", url="hi", iteration=15)

    def test_url_resolves_to_correct_view(self):
        found = resolve('/dashboard_ajax/')
        self.assertEqual(found.func, views.dashboard_ajax)

    def test_json_response(self):
        self.c.login(username='hiren', password='bunny')
        response = self.c.get('/dashboard_ajax/')
        self.assertEqual(response['Content-Type'], 'application/json')
        self.assertEqual(response.json(), [{'id': 1, 'title': 'title', 'url': 'hi',
                                            'iv': '', 'salt': '', 'iteration': 15, 'created_at': '2012-05-12T00:00:00Z'}])


class FormViewTest(TestCase):

    def setUp(self):
        self.c = Client()
        self.user = Account.objects.create_user(username='hiren', password='bunny')
        self.c.login(username='hiren', password='bunny')

    def test_form_creation(self):
        self.c.post('/form/', {'title': 'title', 'url': 'xyz', 'iteration': 5,
                               'iv': 'xyz', 'salt': 'lobon :D', 'tags': ['x', 'y']})
        self.assertEqual(Bookmark.objects.count(), 1)


class TagsViewTest(TestCase):

    def setUp(self):
        self.c = Client()
        self.user = Account.objects.create_user(username='hiren', password='bunny')
        self.c.login(username='hiren', password='bunny')
        obj = Bookmark(title='xyz', iteration=4)
        obj.save()
        obj.tags.add("hiren")

    def test_returns_all_tags(self):
        response = self.c.get('/tags_ajax/')
        self.assertEqual(response.json(), ['hiren'])


class TagCloudViewTest(TransactionTestCase):

    reset_sequences = True

    def setUp(self):
        self.c = Client()
        self.user = Account.objects.create_user(username='hiren', password='bunny')
        self.c.login(username='hiren', password='bunny')
        obj = Bookmark(title='xyz', iteration=4)
        obj.save()
        obj.tags.add("hiren")

    def test_returns_correct_template(self):
        response = self.c.get('/tags/')
        self.assertTemplateUsed(response, 'tag_cloud.html')

    def test_json_response(self):
        response = self.c.get('/tags/', CONTENT_TYPE='application/json')
        self.assertEqual(response.json(), [{'text': 'hiren', 'weight': 1, 'link': '/tags/hiren/'}])


class BookmarkByTagViewTest(TransactionTestCase):

    reset_sequences = True

    @freeze_time('05/12/2012')
    def setUp(self):
        self.c = Client()
        self.user = Account.objects.create_user(username='hiren', password='bunny')
        obj = Bookmark(title='xyz', iteration=4)
        obj.save()
        obj.tags.add("hiren")

    def test_returns_correct_template(self):
        self.c.login(username='hiren', password='bunny')
        response = self.c.get('/tags/hiren/')
        self.assertTemplateUsed(response, 'tag.html')

    def test_json_response(self):
        self.c.login(username='hiren', password='bunny')
        response = self.c.get('/tags/hiren/', CONTENT_TYPE='application/json')
        self.assertEqual(response.json(), [{'id': 1, 'title': 'xyz', 'url': '', 'iv': '', 'salt': '',
                                            'iteration': 4, 'created_at': '2012-05-12T00:00:00Z'}])


class BookmarkReadonlyViewTest(TransactionTestCase):
    reset_sequences = True

    @freeze_time('05/12/2012')
    def setUp(self):
        self.c = Client()
        self.user = Account.objects.create_user(username='hiren', password='bunny')
        obj = Bookmark(title='xyz', iteration=4)
        obj.save()
        obj.tags.add("hiren")

    def test_returns_correct_template(self):
        self.c.login(username='hiren', password='bunny')
        response = self.c.get('/dashboard/1/')
        self.assertTemplateUsed(response, 'bookmark_readonly.html')

    def test_json_response(self):
        self.c.login(username='hiren', password='bunny')
        response = self.c.get('/dashboard/1/', CONTENT_TYPE='application/json')
        self.assertEqual(response.json(), {'id': 1, 'title': 'xyz', 'url': '', 'iv': '', 'salt': '', 'iteration': 4,
                                           'created_at': '2012-05-12T00:00:00Z'})


class BookmarkEditViewTest(TransactionTestCase):

    reset_sequences = True

    @freeze_time('05/12/2012')
    def setUp(self):
        self.c = Client()
        self.user = Account.objects.create_user('hiren', 'bunny')
        obj = Bookmark(title='xyz', iteration=4)
        obj.save()
        obj.tags.add("hiren")

    def test_returns_correct_template(self):
        self.c.login(username='hiren', password='bunny')
        response = self.c.get('/dashboard/1/edit/')
        self.assertTemplateUsed(response, 'bookmark_edit.html')


class DeleteViewTest(TransactionTestCase):

    reset_sequences = True

    def setUp(self):
        self.c = Client()
        self.user = Account.objects.create_user('hiren', 'bunny')
        obj = Bookmark(title='xyz', iteration=4)
        obj.save()

    def test_redirect_obj_delete(self):
        self.c.login(username='hiren', password='bunny')
        response = self.c.get('/dashboard/1/delete/')
        self.assertEqual(Bookmark.objects.count(), 0)

        self.assertRedirects(response, '/dashboard/')




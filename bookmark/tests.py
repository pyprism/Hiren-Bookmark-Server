from django.core.urlresolvers import resolve
from django.test import TestCase, TransactionTestCase
from django.contrib.auth.models import User
from django.test import Client
from .models import Bookmark
from . import views
from freezegun import freeze_time


class LoginViewTest(TestCase):
    """
    Test for login view
    """
    # reset_sequences = True

    def setUp(self):
        self.c = Client()
        self.user = User.objects.create_user('hiren', 'a@b.com', 'bunny')

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
        self.user = User.objects.create_user('hiren', 'a@b.com', 'bunny')

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
        self.user = User.objects.create_user('hiren', 'a@b.com', 'bunny')

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
        self.user = User.objects.create_user('hiren', 'a@b.com', 'bunny')
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
        self.user = User.objects.create_user('hiren', 'a@b.com', 'bunny')
        self.c.login(username='hiren', password='bunny')

    def test_form_creation(self):
        response = self.c.post('/form/', {'title': 'title', 'url': 'xyz', 'iteration': 5,
                                          'iv': 'xyz', 'salt': 'lobon :D', 'tags': ['x', 'y']})
        self.assertEqual(Bookmark.objects.count(), 1)
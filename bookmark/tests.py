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

    def test_login_url_resolves_to_login_view(self):
        found = resolve('/dashboard/')
        self.assertEqual(found.func, views.dashboard)
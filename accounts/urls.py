from django.urls import path

from . import views

app_name = 'accounts'

urlpatterns = [
    path('', views.login),
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
]
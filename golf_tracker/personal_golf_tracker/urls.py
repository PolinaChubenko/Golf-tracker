from django.urls import path
from django.contrib.auth import views as auth_views
from .views import *
from django.conf.urls.static import static

urlpatterns = [
    path('', index, name='index'),
    path('main/', main_page, name="main_page"),
    path('reg/', reg, name="reg"),
    path('auth/', auth, name="auth"),
    path('login-exit/', exit, name='logout'),
    path('about-us/', about_us, name='about-us'),
    path('documentation/', documentation, name='documentation'),
    path('check-login/', check_login, name='check_login'),
    path('check-email/', check_email, name='check_email'),
    path('calendar/', calendar, name='calendar'),
    path('users/', show_users, name='users'),
    path('create-game/', new_local_game, name='game_creation'),
    path('create-your-game/', your_new_game, name='new_game'),
    path('get-all-places/', get_all_places, name='get-all-places'),
    path('show-profile/', show_profile, name='profile'),
    path('get-html/', get_html, name='get_html'),
    path('settings/', settings, name='settings'),
    path('get-news/', news, name='news'),
    path('competition-save/', save_compit_statistic, name='save_competition'),
    path('get-global-games/', get_global_games, name='global_games'),
    path('get-all-your-games/', get_your_games, name='all_games'),
    path('create-training/', create_training, name='create_training'),
    path('get-your-games/', get_dates_for_statistic, name='show_statistics'),
    path('get-event/', get_event, name='get_event'),
    path('get-events-for-each-day/', get_games, name='get_event'),
    path('get-all-names/', get_all_names),
    path('show-statistic/', show_statistics),
    path('get-training-tasks/', get_training_tasks),
    path('set-training-tasks/', set_training_tasks),
    path('get-true-dates/', get_exist_days),
    path('password-reset/',
         auth_views.PasswordResetView.as_view(
             template_name='password_reset/password_reset_form.html',
             email_template_name='password_reset/password_reset_email.html',
         ),
         name='password_reset'),
    path('password-reset/done/',
         auth_views.PasswordResetDoneView.as_view(
             template_name='password_reset/password_reset_done.html'
         ),
         name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(
             template_name='password_reset/password_reset_confirm.html'
         ),
         name='password_reset_confirm'),
    path('password-reset-complete/',
         auth_views.PasswordResetCompleteView.as_view(
             template_name='password_reset/password_reset_complete.html'
         ),
         name='password_reset_complete'),
]
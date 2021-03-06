# Generated by Django 4.0.3 on 2022-04-03 21:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='GlobalCompetitions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game_name', models.CharField(default='none', max_length=100)),
                ('game_start', models.DateField(null=True)),
                ('game_end', models.DateField(null=True)),
                ('game_coordinates', models.CharField(default='none', max_length=250)),
                ('map', models.CharField(default='none', max_length=250)),
                ('club_name', models.CharField(default='none', max_length=250)),
                ('address', models.CharField(default='none', max_length=250)),
            ],
        ),
        migrations.CreateModel(
            name='LocalCompetitions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('result', models.CharField(default='', max_length=250)),
                ('g_competition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='personal_golf_tracker.globalcompetitions')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OwnCompetitions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game_name', models.CharField(default='none', max_length=100)),
                ('game_start', models.DateField(null=True)),
                ('game_end', models.DateField(null=True)),
                ('game_coordinates', models.CharField(default='none', max_length=250)),
                ('map', models.CharField(default='none', max_length=250)),
                ('result', models.CharField(default='', max_length=250)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_coach', models.BooleanField(default=False)),
                ('bio', models.CharField(default='-', max_length=250)),
                ('skill', models.CharField(default='-', max_length=250)),
                ('status', models.CharField(default='-', max_length=250)),
                ('date_of_birth', models.DateField(null=True)),
                ('city_from', models.CharField(default='-', max_length=250)),
                ('photo', models.ImageField(default='icon.png', upload_to='profile_imgs')),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Trainings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='none', max_length=100)),
                ('date', models.DateField(null=True)),
                ('game_coordinates', models.CharField(default='none', max_length=250)),
                ('list_of_tasks', models.CharField(default='none', max_length=750)),
                ('solved_tasks', models.CharField(default='none', max_length=750)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Statistics_of_own_competitions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(null=True)),
                ('one', models.IntegerField(default=0, null=True)),
                ('two', models.IntegerField(default=0, null=True)),
                ('three', models.IntegerField(default=0, null=True)),
                ('four', models.IntegerField(default=0, null=True)),
                ('five', models.IntegerField(default=0, null=True)),
                ('six', models.IntegerField(default=0, null=True)),
                ('seven', models.IntegerField(default=0, null=True)),
                ('eight', models.IntegerField(default=0, null=True)),
                ('nine', models.IntegerField(default=0, null=True)),
                ('ten', models.IntegerField(default=0, null=True)),
                ('eleven', models.IntegerField(default=0, null=True)),
                ('twelve', models.IntegerField(default=0, null=True)),
                ('thirteen', models.IntegerField(default=0, null=True)),
                ('fourteen', models.IntegerField(default=0, null=True)),
                ('fifteen', models.IntegerField(default=0, null=True)),
                ('sixteen', models.IntegerField(default=0, null=True)),
                ('seventeen', models.IntegerField(default=0, null=True)),
                ('eighteen', models.IntegerField(default=0, null=True)),
                ('sum', models.CharField(default='0', max_length=10)),
                ('is_eighteen', models.BooleanField(default=False)),
                ('competition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='personal_golf_tracker.owncompetitions')),
            ],
        ),
        migrations.CreateModel(
            name='Statistics_of_competitions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(null=True)),
                ('one', models.IntegerField(default=0, null=True)),
                ('two', models.IntegerField(default=0, null=True)),
                ('three', models.IntegerField(default=0, null=True)),
                ('four', models.IntegerField(default=0, null=True)),
                ('five', models.IntegerField(default=0, null=True)),
                ('six', models.IntegerField(default=0, null=True)),
                ('seven', models.IntegerField(default=0, null=True)),
                ('eight', models.IntegerField(default=0, null=True)),
                ('nine', models.IntegerField(default=0, null=True)),
                ('ten', models.IntegerField(default=0, null=True)),
                ('eleven', models.IntegerField(default=0, null=True)),
                ('twelve', models.IntegerField(default=0, null=True)),
                ('thirteen', models.IntegerField(default=0, null=True)),
                ('fourteen', models.IntegerField(default=0, null=True)),
                ('fifteen', models.IntegerField(default=0, null=True)),
                ('sixteen', models.IntegerField(default=0, null=True)),
                ('seventeen', models.IntegerField(default=0, null=True)),
                ('eighteen', models.IntegerField(default=0, null=True)),
                ('sum', models.CharField(default='0', max_length=10)),
                ('is_eighteen', models.BooleanField(default=False)),
                ('competition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='personal_golf_tracker.localcompetitions')),
            ],
        ),
        migrations.CreateModel(
            name='Coaches',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('coach', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('trainee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='personal_golf_tracker.userdata')),
            ],
        ),
    ]

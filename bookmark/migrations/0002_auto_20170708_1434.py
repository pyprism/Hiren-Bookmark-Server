# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-08 08:34
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bookmark', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Browser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_name', models.CharField(max_length=400)),
                ('browser_name', models.CharField(choices=[('fr', 'Firefox'), ('ch', 'Chrome'), ('op', 'Opera'), ('ot', 'Other')], max_length=2)),
                ('device_name', models.CharField(max_length=400)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.AddField(
            model_name='bookmark',
            name='browser',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='bookmark.Browser'),
        ),
    ]
from django.contrib import admin
from .models import UserData
from .models import LocalCompetitions
from .models import GlobalCompetitions
from .models import OwnCompetitions
from .models import Trainings
from .models import Statistics_of_competitions
from .models import Statistics_of_own_competitions


admin.site.register(UserData)
admin.site.register(LocalCompetitions)
admin.site.register(GlobalCompetitions)
admin.site.register(OwnCompetitions)
admin.site.register(Trainings)
admin.site.register(Statistics_of_competitions)
admin.site.register(Statistics_of_own_competitions)
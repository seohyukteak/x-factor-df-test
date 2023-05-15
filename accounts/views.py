from django.shortcuts import render
from .forms import UserCreationForm
import json

with open("setting.json", encoding="UTF-8") as f:
    SETTING = json.loads(f.read())
DataLoadingType = SETTING['MODULE']['DataLoadingType']
DBHost = SETTING['DB']['DBHost']
DBPort = SETTING['DB']['DBPort']
DBName = SETTING['DB']['DBName']
DBUser = SETTING['DB']['DBUser']
DBPwd = SETTING['DB']['DBPwd']
UserTNM = SETTING['DB']['UserTNM']
Login_Method = SETTING['PROJECT']['LOGIN']

# Create your views here.
def login(request):
    if Login_Method == "WEB":
        if request.method == 'GET':
            return render(request, 'common/login.html')
        
def signup(request):
    if request.method == "GET":
        form = UserCreationForm()
        return render(request, 'common/signup.html', {'form': form})
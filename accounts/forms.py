from django import forms
from accounts.models import User


class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(
        label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('id', 
                  'username', 
                  'email', 
                  'fullname', 
                  'phone', 
                  'dept_name', 
                  'team_name',
                  'rank_name')
        labels = {
            'id' : '사용자아이디'
        }

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


# class UserChangeForm(forms.ModelForm):
#     password = ReadOnlyPasswordHashField()

#     class Meta:
#         model = User
#         fields = ('email', 'password', 'date_of_birth',
#                   'is_active', 'is_admin')

#     def clean_password(self):
#         return self.initial["password"]
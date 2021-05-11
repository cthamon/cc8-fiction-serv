# cc8-group-serv

Port 8000

### user
| Description | Method | Route | Header | Body | Status |
|---|---|---|---|---|---|
| register | POST | [/user/register]() | multipart/form-data | [form-data]() [text:]() {email, username, password, confirmPassword, profileImg, description, address, phoneNumber} / [file:]() {image} | on progress |
| login | POST | [/user/login]() | | {"email": "?", "username": "?", "password": "?"} | done |
| change password | PATCH | [/user/password]() | | {"currentPassword": "?", "password": "?", "confirmPassword": "?"} | done |
| update profile pic | PATCH | [/user/updatepic]() | | [form-data]() [file:]() {image} | done |
| delete profile pic | PATCH | [/user/deletepic]() | | [form-data]() [file:]() {image} | done |
| update user | PATCH | [/user/edit]() | | [form-data]() [text:]() {description} | done |
| update user with password confirm | PATCH | [/user/edit]() | | [form-data]() [text:]() {currentPassword, description, address, phoneNumber} |  on progress |

### novel

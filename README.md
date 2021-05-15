# cc8-group-serv

Port 8000

### user
| Description | Method | Route | Header | Body | Status |
|---|---|---|---|---|---|
| register | POST | [/user/register]() | multipart/form-data | [form-data]() ([text:]()) {email, username, password, confirmPassword, profileImg, description, address, phoneNumber} / ([file:]()) {image} | WIP (error if no file chosen) |
| login | POST | [/user/login]() | | {"email": "?", "username": "?", "password": "?"} | done |
| change password | PATCH | [/user/password]() | TOKEN | {"currentPassword": "?", "password": "?", "confirmPassword": "?"} | done |
| update profile pic | PATCH | [/user/updatepic]() | TOKEN | [form-data]() [file:]() {image} | done |
| delete profile pic | PATCH | [/user/deletepic]() | TOKEN | | done |
| update user | PATCH | [/user/edit]() | TOKEN | [form-data]() [text:]() {description} | done |
| update user with password confirm | PATCH | [/user/edit]() | TOKEN | [form-data]() [text:]() {currentPassword, description, address, phoneNumber} |  WIP |

### novel
| Description | Method | Route | Header | Body | Status |
|---|---|---|---|---|---|
| fetch all novel | get | [/novel/]() | | | done |
| fetch novel by user | get | [/novel/user]() | | | done |
| create novel | POST | [/novel/create]() | TOKEN | [form-data]() ([text:]()) {title, description, novelType, cover} / ([file:]()) {image} | WIP (error if no file chosen) |
| update cover pic | PATCH | [/novel/updatepic/:id]() | TOKEN | [form-data]() [file:]() {image} | done |
| update novel info | PATCH | [/novel/delete/:id]() | TOKEN || done |
| delete content | DELETE | [/deletenovel/:Id/:episodeNumber]() | TOKEN | {episodeTitle, content} | done |
| create content | POST | [/novel/createcontent/:novelId]() | TOKEN | { episodeTitle, content} | done |
| update content | PATCH | [/editcontent/:novelId/:episodeNumber]() | TOKEN | {episodeTitle, content} | done |
| delete content | DELETE | [/deletecontent/:novelId/:episodeNumber]() | TOKEN || done |


# cc8-group-serv

localhost:8000

### user
| Description | Method | Route | Header | Body | Status |
|---|---|---|---|---|---|
| register | POST | [/user/register]() | multipart/form-data | [form-data]() ([text:]()) {email, username, password, confirmPassword, profileImg, description, address, phoneNumber} / ([file:]()) {image} | WIP (error if no file chosen) |
| login | POST | [/user/login]() | | {"email": "?", "username": "?", "password": "?"} | done |
| userinfo | GET | [/user/me]() | | | done |
| change password | PATCH | [/user/password]() | TOKEN | {"currentPassword": "?", "password": "?", "confirmPassword": "?"} | done |
| update profile pic | PATCH | [/user/updatepic]() | TOKEN | [form-data]() [file:]() {image} | done |
| delete profile pic | PATCH | [/user/deletepic]() | TOKEN | | done |
| update user | PATCH | [/user/edit]() | TOKEN | [form-data]() [text:]() {description} | done |
| update user with password confirm | PATCH | [/user/edit]() | TOKEN | [form-data]() [text:]() {currentPassword, description, address, phoneNumber} |  WIP |

### novel
| Description | Method | Route | Header | Body | Status |
|---|---|---|---|---|---|
| fetch all novel | GET | [/novel/]() | | | done |
| fetch novel by user | GET | [/novel/user]() | | | done |
| fetch novel | GET | [/novel/:id]() | | | done |
| fetch all episode of novel | GET | [/novel/:novelId/episode]() | | | done |
| fetch episode number of novel by id | GET | [/novel/content/:id]() | | | done |
| fetch episode number of novel | GET | [/novel/:novelId/episode/:episodeNumber]() | | | done |
| create novel | POST | [/novel/create]() | TOKEN | [form-data]() ([text:]()) {title, description, novelType, cover, price} / ([file:]()) {image} | WIP (error if no file chosen) |
| create content | POST | [/novel/createcontent/:novelId]() | TOKEN | { episodeNumber, episodeTitle, content, price} | done |
| update cover pic | PATCH | [/novel/updatepic/:id]() | TOKEN | [form-data]() [file:]() {image} | done |
| update novel info | PATCH | [/novel/edit/:id]() | TOKEN | {title, description, novelType, price} | done |
| edit episode of novel by id | PATCH | [/novel/editcontent/:id]() | TOKEN | {title, description, novelType, price} | done |
| delete novel | DELETE | [novel/:id]() | TOKEN || done |
| delete content | DELETE by id | [/content/:novelId/:episodeNumber]() | TOKEN || done |

### rating & comment
| Description | Method | Route | Header | Body | Status |
|---|---|---|---|---|---|
| get rating by novel | GET | [/novel/rating/novelId]() | | | done |
| create rating | POST | [/novel/rating/:novelId]() | TOKEN | { score, comment } | done |
| update rating | PATCH | [/novel/updaterating/:novelId]() | TOKEN | { score, comment } | done |
| delete rating | DELETE | [/novel/rating/:id]() | TOKEN | | done | 
| get comment by episode | GET | [/novel/comment/:novelContentId]() | | done |
| get comment by episode (optional) | GET | [/novel/comment/:novelId/:episodeNumber]() | | done |
| create comment | POST | [/novel/comment/:novelContentId]() | TOKEN | { comment } | done |
| create comment (optional) | POST | [/novel/comment/:novelId/:episodeNumber]() | TOKEN | { comment } | done |
| update comment | PATCH | [/novel/updatecomment/:id]() | TOKEN | { comment } | done |
| delete comment | DELETE | [/novel/comment/:id]() | TOKEN | | done | 

### follow writer(user) & follow novel
| Description | Method | Route | Header | Body | Status |
|---|---|---|---|---|---|
| get following list | GET | [/user/follow]() | TOKEN | | done |
| follow writer(user) | POST | [/user/follow/:followingId]() | TOKEN | | done |
| unfollow writer(user) | DELETE | [/user/unfollow/:id]() | TOKEN | | done |
| get following novel list | GET | [/user/follownovel]() | TOKEN | | done |
| follow novel | POST | [/user/follownovel/:novelId]() | TOKEN | | done |
| unfollow novel | DELETE | [/user/unfollow/:id]() | TOKEN | | done |

### read history
| Description | Method | Route | Header | Body | Status |
|---|---|---|---|---|---|
| get read history | GET | [/user/history]() | TOKEN | | done |
| read history trigger | POST | [/user/read/:novelContentId]() | TOKEN | | done |
| delete history | DELETE | [/user/unread/:id]() | TOKEN | | done |
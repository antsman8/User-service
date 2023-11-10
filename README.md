Привет!

Сначала нужно установить зависимости из package.json

Затем создать бд user в Postgresql (Скрипт в корне директории)

Затем создать файл .env в корень и установить туда параметры подключения к своей бд:
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=

Затем запустить сервис (npm run start:dev)

После этого можно отправлять на сервис HTTP запросы
(POST)
http://localhost:3000/api/user

{ "email": "36@example.com",
"password": "dgsdasdasfs"
}

После такого запроса вернется созданный юзер, запишется в бд user, а сервис отправит событие на второй сервис (второй сервис должен быть запущен)

Можно обновлять юзеров методом (PATCH)

http://localhost:3000/api/user/2

{ "email": "37@example.com",
"password": "dgsdasdasfs"
}

Добавляем в запрос id и в теле меняем данные этого пользователя. Сервис перезапишет юзера в бд и пошлет событие на второй сервис.

(GET)
http://localhost:3000/api/user

Этот запрос выдаст всех созданных пользователей

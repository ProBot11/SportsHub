# SportsHub

## To Run It
You need to open terminal in the folder where the project is present type the following.
```sh
npm i

touch .env
```
Now that you have created the .env file, you have to fill it up using your system's MySQL credentials which includes host, user database, password, database name, secret and the your own key for the news API which you can find at https://newsapi.org/s/india-sports-news-api

.env file contents:

```.env
HOST=
USER_DB=
PASSWORD=
DB_NAME=
SECRET=
NEWS_API=
```
After all of this is done, install XAMPP and run the MySQL and Apache servers.

Finally, open the terminal in the project folder and use
```
npm start
```

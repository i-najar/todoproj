# EJS Todo Project

## This project lets users organize their tasks utilizing a web application. 

The core of this project is to provide users with the ability to create, delete, and retrieve their tasks. Features include:

* An account-based system to ensure all tasks are personalized.
* Password encryption to keep information safe.
* A Postgres database connection for data permanence.
* Three-tiered task prioritization (high, medium, low) represented through text and color.
* Current weather updates for the location of your choosing.

## Tech stack:
* JavaScript
* Express.js
* EJS.js
* Bootstrap
* PostgreSQL
* HTML
* CSS
  
## Dependencies
* pg
* Jest
* jwt
* bcrypt
* axios

## Personalizing this project

As this file requires API keys, Postgres database information, and session secrets, it is important to configure your .env file to meet your needs. The following list includes relevant variables that need defining, as well as links to documentation for each:

Weather API:
Documentation: https://openweathermap.org/appid

Variables:
* Your API Key
* Your location's longitude
* Your location's latitude

Postgres Database:
I used pgAdmin to initialize and structure my database.
Documentation: https://www.pgadmin.org/docs/pgadmin4/latest/getting_started.html

Variables:
* Database (db) password
* db username
* db host
* db name
* db port

Express:
Documentation: https://expressjs.com/en/resources/middleware/cookie-session.html

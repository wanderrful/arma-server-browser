I made this project as an exercise for working with both the front and the back end of web development.  It's a server browser as a web app, hosted on Heroku.



---



Required environment variables:
- DATABASE_URL:  the PostgreSQL server connection address to use
- DB_PASSWORD: (only needed if running via localhost) the password to help you connect to the Postgres server
- REFRESH_RATE: the amount of time (in minutes) between server list refresh requests on the back-end
- PORT: the server port number to use for this web app
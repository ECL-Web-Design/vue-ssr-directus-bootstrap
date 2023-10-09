# SSR Rendering server for the project

Client build dist goes in build directory, make sure you run npm install before starting the server

Server setup is ripped mostly from https://github.com/frandiox/vite-ssr/tree/master/examples with some modifications.

Don't change anything without knowing what you are doing, it could prevent the site from being served.

# Service File

After setting up the server, rename `service/rename-me.service` to something sensible and point the nodemon route to
your server file, this will ensure the server is restarted with any code changes and on machine reboot

Run `systemctl start <renamed-service-file>.service` to start.

# Vue Router Config

The current implementation uses a dynamic routing system that allows users to set their routes on the server cms.

If you would like to switch to a static setup simply ignore the server routes and add your routes to `routes.ts` as
normal, you will also need to remove the dynamic routes fetch from `main.ts` as well.

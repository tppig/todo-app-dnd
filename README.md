# todo-app-dnd
## Overview
This is a TODO APP web application based on Nodejs, Express and 
React. There are two parts in the repo: client and server. The
client is a react app. The server is a nodejs app which provides
a few APIs to the client for CRUD operations.

This APP is derived from [docker/getting-started](https://github.com/docker/getting-started).
When I learned the tutorial of docker, I found the TODO APP is really
nice and I use it in my work. But I want one more thing from the app:
to drag the items and order them. That's why I made this repo.

## Running the App
I have pushed pre-built two docker images to [dockerhub](https://hub.docker.com/repositories/oos1111?search=todo-app-dnd). 
To run the app, just download `todo-app-dnd/docker-compose.yml` and
start it:
```
# go to the path of todo-app-dnd/docker-compose.yml
cd <path/to/todo-app-dnd/docker-compose.yml>
docker compose up -d
```
**Note**: You should use the `docker-compose.yml` under`todo-app-dnd`
directory, not the one under root.

Of course you can also use the `docker-compose.yml` under root. That
will mount the local project to 2 node-alpine images and start the
app. That is for developing.
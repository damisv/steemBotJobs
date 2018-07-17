# MEAN, socket.io, Agenda, Steem
An application that provides the ability of creating jobs at certain intervals, with live logging.The scripts that run refer to Steemit actions.

## Commands
- `npm run start`: Starts both frontend and API server as separate live reload server. Frontend uses `ng serve` underneath and API server uses `nodemon` for live reload.

- `npm run build`: Creates `dist` folder in both `client` and `server` folders.

- `npm run start:prod`: Builds the `client` and `server` projects.

## Deploy
The base project was heavily influenced by Angular-Typescript-Node-Starter, but modified to newer versions and fixed so it can be automatically build on Heroku.

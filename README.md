# fullstack

> Access the app here: [http://brainwaves.programminggeek.in/](http://brainwaves.programminggeek.in/)

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`




### Start the App

1. Run `npm install` to install server dependencies.

2. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running or ignore if you want to connect to the cloud.

3. Update the config mongodb uri in `server/config/environment/development.js` or `server/config/environment/index.js`.

4. Set `seedDB` to true in the config depending  `server/config/environment/development.js` or `server/config/environment/index.js`.

5. The default mongo `uri` is connected to `cloud`. Do not change it to connect to cloud mongodb.

6. Run `npm start` to start the development server. Access the app at http://localhost:3000/


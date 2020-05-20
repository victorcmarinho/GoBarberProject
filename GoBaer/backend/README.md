<h1 align="center">
<img src="frontend/src/assets/minimal-logo.svg" width="200px">
</h1>

### :page_with_curl: About
This project is based on an application for a hair salon. Containing scheduling, appointments, session and authentication.
Using TypeScript to created this project.

#### To start, **Docker** is required
- `docker run --name postgres -e POSTGRES_PASSWORD=[mysecretpassword] -d postgres`
- `docker ps -a`
- `docker start [conterinerID]`


#### How to , **Docker** is required


### :rocket: How to install and start 
- `git clone https://github.com/victorcmarinho/GoBarber`
- **Go to repository folder**
- `docker-compose up` (in Backend)
- `yarn start` (in Frontend)

### :page_facing_up: Routes in Backend

- **post('/users')** - Create a login
- **post('/sessions')** - Log in to an account

#### From here, authentication is required

- **put('/users')** - Update an account
- **get('/providers')** - List providers
- **get('/providers/:providerId/available')** - Check provider availability
- **post('/appointments')** - Create an appointment
- **get('/appointments')** - List all logged-in user's appointments
- **delete('/appointments/:id')** - Delete an appointment
- **get('/schedule')** - Schedule services
- **post('/files')** - Profile pictures
- **get('/notifications')** - List all logged in user notifications
- **put('/notifications/:id')** - Confirm notification was seen    

<!-- ### :heavy_check_mark: Result in Frontend

<p align="center">
  <img alt="" src="frontend/public/barber.gif">
</p>

### :heavy_check_mark: Result in Mobile

<p align="center">
  <img alt="" src="mobile/public/barber.gif">
</p> -->


## :rocket: Technologies

This project was developed at the [RocketSeat GoStack Bootcamp](https://rocketseat.com.br/bootcamp) with the following technologies:

-  [Node.js][nodejs]
-  [Express](https://expressjs.com/)
-  [nodemon](https://nodemon.io/)
-  [Sucrase](https://github.com/alangpierce/sucrase)
-  [Sequelize](http://docs.sequelizejs.com/)
-  [PostgreSQL](https://www.postgresql.org/)
-  [node-postgres](https://www.npmjs.com/package/pg)
-  [Redis](https://redis.io/)
-  [MongoDB](https://www.mongodb.com/)
-  [Mongoose](https://mongoosejs.com/)
-  [JWT](https://jwt.io/)
-  [Multer](https://github.com/expressjs/multer)
-  [Bcrypt](https://www.npmjs.com/package/bcrypt)
-  [Youch](https://www.npmjs.com/package/youch)
-  [Yup](https://www.npmjs.com/package/yup)
-  [Bee Queue](https://www.npmjs.com/package/bcrypt)
-  [Nodemailer](https://nodemailer.com/about/)
-  [date-fns](https://date-fns.org/)
-  [Sentry](https://sentry.io/)
-  [DotEnv](https://www.npmjs.com/package/dotenv)
-  [TypeScript](https://www.typescriptlang.org/)
-  [Docker](https://www.docker.com/)
-  [DockerPostgress](https://hub.docker.com/_/postgres)
-  [VS Code][vc] with [ESLint][vceslint]

---

<p align="center">
  Made with by <a href="https://www.linkedin.com/in/victorcmarinho">Victor Marinho</a>
</p>

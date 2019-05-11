'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const sequelize = require('./models').sequelize;

// Routes
const routes = require('./routes/index');
const courseRoutes = require('./routes/course');
const userRoutes = require('./routes/user')
// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// Setup request body JSON parsing.
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here
app.use('/api', routes);
//app.use('/api/courses', courseRoutes);
//app.use('/api/user', userRoutes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .then(() => {
    console.log('Syncing database with models');
    sequelize.sync({ force: true })
    .then(() => {
      console.log(`Database & tables created!`)
    })
    .then(() => {
      // set our port
      const port = process.env.PORT || 6000;

      // start listening on our port
      app.listen(app.get('port'), () => {
        console.log(`Express server is listening on port ${port}`);
      });
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });






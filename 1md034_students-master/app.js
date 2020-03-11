/* jslint node: true */
/* eslint-env node */
'use strict';

// Require express, socket.io, and vue
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// Pick arbitrary port for server
const port = 3000;
app.set('port', (process.env.PORT || port));

// Serve static assets from public/
app.use(express.static(path.join(__dirname, 'public/')));
// Serve vue from node_modules as vue/
app.use('/vue',
  express.static(path.join(__dirname, '/node_modules/vue/dist/')));
// Serve index.html directly as root page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});
// Serve map.html as /map
app.get('/map', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/map.html'));
});
app.get('/reg', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/reg.html'));
});
app.get('/wait', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/waitForAdmin.html'));
});
app.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname, 'views/admin.html'));
});

// Serve dispatcher.html as /dispatcher
app.get('/dispatcher', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/dispatcher.html'));
});
app.get('/loggedIn', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/loggedIn.html'));
});
app.get('/profile', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/profile.html'));
});
app.get('/messages', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/messages.html'));
});
app.get('/match', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/rateyourdate.html'));
});
app.get('/ryd2', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/rateyourdate2.html'));
});
app.get('/ryd3', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/rateyourdate3.html'));
});
app.get('/meetAgain', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/meetAgain.html'));
});
app.get('/yourMatches', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/yourMatches.html'));
});
app.get('/date1', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/currentDate.html'));
});
app.get('/date2', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/currentDate2.html'));
});
app.get('/date3', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/currentDate3.html'));
});




// Store data in an object to keep the global namespace clean and
// prepare for multiple instances of data if necessary
function Data() {
    this.orders = {};
    this.femma = 5;
}

/*
  Adds an order to to the queue
*/
Data.prototype.addOrder = function(order) {
  // Store the order in an "associative array" with orderId as key
  this.orders[order.orderId] = order;
};

Data.prototype.sendConsole = function() {
    return this.femma;
}

Data.prototype.getAllOrders = function() {
  return this.orders;
};



const data = new Data();

io.on('connection', function(socket) {
  // Send list of orders when a client connects
    socket.emit('initialize', { data1: data.sendConsole()});

    // When a connected client emits an "addOrder" message
    socket.on('addOrder', function(order) {
	data.addOrder(order);
	// send updated info to all connected clients,
	// note the use of io instead of socket
	io.emit('currentQueue', { orders: data.getAllOrders() });
    });
    socket.on('sendConsole', function(hej) {
	io.emit('skickaEtta', { ettan: data.sendConsole() });
    });
});

/* eslint-disable-next-line no-unused-vars */
const server = http.listen(3000, function() {
  console.log('Server listening on port ' + app.get('port'));
});

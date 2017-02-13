
/**
 * Created by Abhi on 6/12/16.
 */
'use strict';
const express = require('express');
var cors = require('cors');
const bodyParser= require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
app.use(cors());
var jwt = require('express-jwt');
var auth0Settings = require('./auth0.json');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var DBurl = 'mongodb://abhilash.shrivastava:ab#ILASH0@ds019471.mlab.com:19471/meet-the-need-db';
var LocalDbUrl = 'mongodb://localhost:27017/test';
var helper = require('sendgrid').mail;
var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY);
var textbelt = require('textbelt');
var jwtCheck = jwt({
  secret: new Buffer(auth0Settings.secret, 'base64'),
  audience: auth0Settings.audience
});
var apiKey = 'OHqPyicFcGk6b5LEu7gbrw';
var easypost = require('node-easypost')(apiKey);
var stripe = require("stripe")("sk_test_kVfd9jhyoTvCG7ILbb5oBft2");

var db;
var responseToSender = [];
var responseToProvider = [];
var response = {
  status: 'Saved'
};

app.use(bodyParser.json());
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.use('/sender-list', jwtCheck);
app.post('/sender-list', function(req, res) {
  res.connection.setTimeout(0);
  getParcelSenderList(req.body, function (responseToProvider) {
    res.send(JSON.stringify(responseToProvider));
  });
});

app.use('/provider-list', jwtCheck);
app.post('/provider-list', function(req, res) {
  res.connection.setTimeout(0);
  getServiceProviderList(req.body, function (responseToSender) {
  res.send(JSON.stringify(responseToSender));
  });
});

app.use('/save-user', jwtCheck);
app.post('/save-user', function(req, res) {
  db.collection('user').save(req.body, function(err, result){
  res.connection.setTimeout(0);
  if (err) return console.log(err);
  sendEmail(req.body.email,"User Account created as " + req.body.nickname, "You have successfully logged in with Meet-the-Need App");
  res.send(JSON.stringify(response));
  })
});

app.use('/select-provider', jwtCheck);
app.post('/select-provider', function(req, res) {
  res.connection.setTimeout(0);
  assignProviderForApproval(req.body, function(responseToSender) {
    res.send(JSON.stringify(responseToSender));
  });
});

app.use('/select-parcel', jwtCheck);
app.post('/select-parcel', function(req, res) {
  res.connection.setTimeout(0);
  assignParcelForApproval(req.body, function(responseToSender) {
  res.send(JSON.stringify(responseToSender));
  });
});


MongoClient.connect(LocalDbUrl, function(err, database){
  if (err) return console.log(err)
  db = database
  app.listen(9000, function(){
    console.log('listening on 9000');
  })
});

app.use('/assigned-service-request', jwtCheck);

app.post('/assigned-service-request', function (req, res) {
  res.connection.setTimeout(0);
  assignedServiceRequest(req.body, function(requests){
  res.send(JSON.stringify(requests));
  })
});

app.use('/unassigned-service-request', jwtCheck);

app.post('/unassigned-service-request', function (req, res) {
  res.connection.setTimeout(0);
  unassignedServiceRequest(req.body, function(requests) {
    res.send(JSON.stringify(requests));
  })
});

app.use('/assigned-sender-request', jwtCheck);

app.post('/assigned-sender-request', function (req, res) {
  res.connection.setTimeout(0);
  assignedSenderRequest(req.body, function(requests) {
    res.send(JSON.stringify(requests));
  })
});

app.use('/unassigned-sender-request', jwtCheck);

app.post('/unassigned-sender-request', function (req, res) {
  res.connection.setTimeout(0);
  unassignedSenderRequest(req.body, function(requests){
    res.send(JSON.stringify(requests));
  })
});


app.use('/parcel-receiving-request', jwtCheck);

app.post('/parcel-receiving-request', function (req, res) {
  res.connection.setTimeout(0);
  parcelReceivingRequest(req.body, function(requests){
    res.send(JSON.stringify(requests));
  })
});

app.use('/change-status', jwtCheck);

app.post('/change-status', function (req, res) {
  res.connection.setTimeout(0);
  parcelStatusChange(req.body, function(requests){
    res.send(JSON.stringify(requests));
  })
});

app.use('/service-details', jwtCheck);

app.post('/service-details', function (req, res) {
  res.connection.setTimeout(0);
  getServiceProviderDetails(req.body, function(requests) {
    res.send(JSON.stringify(requests));
  })
});

app.use('/sender-details', jwtCheck);

app.post('/sender-details', function (req, res) {
  res.connection.setTimeout(0);
  getParcelSenderDetails(req.body, function(requests){
    res.send(JSON.stringify(requests));
  })
});

app.use('/cancel-request', jwtCheck);
app.post('/cancel-request', function (req, res) {
  res.connection.setTimeout(0);
  cancelRequest(req.body, function(response){
    res.send(JSON.stringify(response));
  })
});


app.use('/update-request', jwtCheck);
app.post('/update-request', function (req, res) {
  res.connection.setTimeout(0);
  updateRequest(req.body, function(response){
    res.send(JSON.stringify(response));
  })
});


app.use('/reject-request', jwtCheck);

app.post('/reject-request', function (req, res) {
  res.connection.setTimeout(0);
  rejectRequest(req.body, function(response){
    res.send(JSON.stringify(response));
  })
});

app.use('/parcel-price', jwtCheck);
app.post('/parcel-price', function (req, res) {
  res.connection.setTimeout(0);
  getParcelRates(req.body, function(response){
    res.send(JSON.stringify(response));
  })
});

app.use('/save-card', jwtCheck);
app.post('/save-card', function(req, res) {
  res.connection.setTimeout(0);
  saveCard(req.body, function (response) {
    res.send(JSON.stringify(response));
  });
});

app.use('/charged-details', jwtCheck);
app.post('/charged-details', function(req, res) {
  res.connection.setTimeout(0);
  getChargedDetails(req.body, function (response) {
    res.send(JSON.stringify(response));
  });
});

var saveCard = function(cardDetails, callback) {
  // Create a Customer:
  stripe.customers.create({
    email: cardDetails.email,
    source: cardDetails.token
  }).then(function(customer) {
    customer.cardName = cardDetails.cardName;
    db.collection('customer').save(customer, function(err, result){
      if (err) return console.error(err);
      callback(200);
      console.log("saved to customer");
    });
  });
};

var chargeCard = function(id, email, charge) {
  var cursor = db.collection('customer').find({email: email});
  cursor.each(function(error, data) {
    if (error) return console.error(error);
    if (data != null) {
      stripe.charges.create({
        amount: charge*100,
        currency: "usd",
        customer: data.id
      }).then(function(charge) {
        charge.email = email;
        charge.created = new Date(charge.created*1000).split('T')[0];
        db.collection('chargeDetails').save(charge, function(err, result){
          if (err) return console.error(err);
          console.log("saved to charge details");
          db.collection('providerAssigned').updateOne(
            { "_id": ObjectId(id)},
            {
              $set: {'transaction_id': charge.id},
            }, function(err, results) {
              console.log('transaction id attached');
            });
        });
      });
    }
  })
};

var getChargedDetails = function(data, callback) {
  var chargedDetails = [];
  var cursor = db.collection('chargeDetails').find({email: data.email});
  cursor.each(function(error, data) {
    if (error) return console.error(error);
    if (data != null) {
      chargedDetails.push(data);
    }else {
      callback(chargedDetails);
    }
  })
};

var getParcelRates = function(parcelDetails, callback) {
  // set addresses
  var toAddress, fromAddress, parcel;
  if (parcelDetails.senderEmail) {
    toAddress = {
      "street1": parcelDetails.deliveryAddreddaddressLine1,
      "street 2": parcelDetails.deliveryAddreddaddressLine2,
      "city": parcelDetails.deliveryCity,
      "state": parcelDetails.deliveryState,
      "zip": parcelDetails.deliveryZip,
      "country": 'US'
    };

    fromAddress = {
      "street1": parcelDetails.currentAddreddaddressLine1,
      "street2": parcelDetails.currentAddreddaddressLine2,
      "city": parcelDetails.currentCity,
      "state": parcelDetails.currentState,
      "zip": parcelDetails.currentZip,
      "country": 'US'
    };

    parcel={
      "length": parseInt(parcelDetails.parcelLength),
      "width": parseInt(parcelDetails.parcelWidth),
      "height": parseInt(parcelDetails.parcelHeight),
      "weight": parseInt(parcelDetails.parcelWeight)
    };

  } else if (parcelDetails.email) {
    toAddress = {
      "street1": parcelDetails.destinationAddreddaddressLine1,
      "street 2": parcelDetails.destinationAddreddaddressLine2,
      "city": parcelDetails.destinationCity,
      "state": parcelDetails.destinationState,
      "zip": parcelDetails.destinationZip,
      "country": 'US'
    };

    fromAddress = {
      "street1": parcelDetails.currentAddreddaddressLine1,
      "street2": parcelDetails.currentAddreddaddressLine2,
      "city": parcelDetails.currentCity,
      "state": parcelDetails.currentState,
      "zip": parcelDetails.currentZip,
      "country": 'US'
    };

    parcel={
      "length": parseInt(parcelDetails.maxParcelLength),
      "width": parseInt(parcelDetails.maxParcelWidth),
      "height": parseInt(parcelDetails.maxParcelHeight),
      "weight": parseInt(parcelDetails.maxParcelWeight)
    };
  }

// create shipment
  easypost.Shipment.create({
    to_address: toAddress,
    from_address: fromAddress,
    parcel: parcel
  }, function(err, shipment) {
    if (err){
      console.error(err);
      return
    }
    var rates = [];
    if (shipment.rates.length > 0){
      for (var index in shipment.rates) {
        var rate = {};
        rate.service = shipment.rates[index].service;
        rate.carrier = shipment.rates[index].carrier;
        rate.rate = shipment.rates[index].rate;
        rates.push(rate)
      }
    }
    callback(rates);
  });
};

var assignProvider =  function (data, callback) {
  if (data._id != null){
    data._id = ObjectId(data._id);
  }
  var cursorone = db.collection('parcelSender').find( { "currentCity": data.currentCity, "deliveryCity": data.destinationCity, "parcelWeight": { $lte: (data.maxParcelWeight) }, "parcelHeight": { $lte: (data.maxParcelHeight)}, "parcelLength": { $lte: (data.maxParcelLength)}, "parcelWidth": { $lte: (data.maxParcelWidth)}, "startDeliveryDate" : {$lte: data.journeyDate}, "endDeliveryDate" : {$gte: data.journeyDate}} ).sort({parcelWeight: -1}).limit(1);
  cursorone.count(function (e, count) {

    if (count == 0){
      db.collection('serviceProvider').save(data, function(err, result){
        if (err) return console.log(err);
          responseToProvider = [];
          callback(responseToProvider);
          sendRaisedEmailToProvider(data);
          console.log("saved to serviceProvider");
      })
    }
    else {
      cursorone.each(function(err, sender){
        if (sender !== null){
          if (!sender["serviceProvider"] && sender["status"] !== "Assigned To Service Provider"){
            sender["serviceProvider"] = data;
            sender["status"] = "Assigned To Service Provider";
          }
          db.collection('providerAssigned').insertOne(sender, function(err, result){
            if (err) return console.log(err);
          db.collection('parcelSender').deleteOne(
            { "_id": sender._id },
            function(err, results) {
              console.log('deleted from parcelSender');
              data.maxParcelWeight -= sender.parcelWeight;
              data.maxParcelHeight -= sender.parcelHeight;
              data.maxParcelLength -= sender.parcelLength;
              data.maxParcelWidth -= sender.parcelWidth;
              responseToProvider.push(sender);
              db.collection('serviceProvided').insertOne( data, function(err, results) {
                console.log('saved to serviceProvided');
                cursorone.close();
                db.collection('parcelSender').find( { "currentCity": data.currentCity, "deliveryCity": data.destinationCity, "parcelWeight": { $lt: (data.maxParcelWeight +1) }, "parcelHeight": { $lt: (data.maxParcelHeight + 1)}, "parcelLength": { $lt: (data.maxParcelLength + 1)}, "parcelWidth": { $lt: (data.maxParcelWidth + 1)}} ).count(function (e, count) {
                  if (count == 0){
                    callback(responseToProvider);
                  }else {
                    sendAssignedEmailToProvider(sender, data);
                    sendAssignedEmailToSender (sender, data);
                    sendAssignedEmailToReceiver(sender, data);
                    assignProvider(data, callback);
                  }
                });
              });
            });
        })
        }
      });
    }
  })
};


var assignParcelForApproval =  function (data, callback) {
  if (data._id != null){
    data._id = ObjectId(data._id);
  }
  data["status"] = "Pending Approval At Parcel Sender";
  db.collection('providerAssigned').insertOne(data, function(err, result){
    if (err) return console.log(err);
  responseToSender = [];
  responseToSender.push(data);
  callback(responseToSender);
  db.collection('parcelSender').deleteOne({"_id": ObjectId(data._id)}, function (err, result) {
    if (err) return console.log(err);
    console.log('Deleted from parcel Sender');
  });
  sendAssignedEmailToProvider(data, data.serviceProvider);
  sendAssignedEmailToSender (data, data.serviceProvider);
  sendAssignedEmailToReceiver(data, data.serviceProvider);
  data.serviceProvider.maxParcelWeight -= data.parcelWeight;
  data.serviceProvider.maxParcelHeight -= data.parcelHeight;
  data.serviceProvider.maxParcelLength -= data.parcelLength;
  data.serviceProvider.maxParcelWidth -= data.parcelWidth;
  if ((data.serviceProvider.maxParcelWeight < 1) || (data.serviceProvider.maxParcelHeight < 1) || (data.serviceProvider.maxParcelLength < 1) || (data.serviceProvider.maxParcelWidth < 1) ) {
    db.collection('serviceProvider').deleteOne(
      { "_id": ObjectId(data.serviceProvider._id) },
      function(err, results) {
        if (err) return console.log(err);
        console.log("Deleted from serviceProvider");
        db.collection('serviceProvided').insertOne( data.serviceProvider, function(err, results) {
          console.log('saved to serviceProvided');
        });
      });
  }else {
    db.collection('serviceProvider').updateOne(
      { "_id": ObjectId(data.serviceProvider._id) },
      {
        $set: { "maxParcelWeight": data.serviceProvider.maxParcelWeight, "maxParcelHeight": data.serviceProvider.maxParcelHeight, "maxParcelLength": data.serviceProvider.maxParcelLength, "maxParcelWidth": data.serviceProvider.maxParcelWidth },
      }, function(err, results) {
        if (err) return console.log(err);
        console.log('updated serviceProvider');
        db.collection('serviceProvided').insertOne( data.serviceProvider, function(err, results) {
          console.log('saved to serviceProvided');
        });
      });
  }
});
};



var assignProviderForApproval =  function (data, callback) {
  if (data._id != null){
    data._id = ObjectId(data._id);
  }
  data["status"] = "Pending Approval At Service Provider";
  db.collection('providerAssigned').insertOne(data, function(err, result){
    if (err) return console.log(err);
  responseToSender = [];
  responseToSender.push(data);
  callback(responseToSender);
  sendAssignedEmailToProvider(data, data.serviceProvider);
  sendAssignedEmailToSender (data, data.serviceProvider);
  sendAssignedEmailToReceiver(data, data.serviceProvider);
  data.serviceProvider.maxParcelWeight -= data.parcelWeight;
  data.serviceProvider.maxParcelHeight -= data.parcelHeight;
  data.serviceProvider.maxParcelLength -= data.parcelLength;
  data.serviceProvider.maxParcelWidth -= data.parcelWidth;
  if ((data.serviceProvider.maxParcelWeight < 1) || (data.serviceProvider.maxParcelHeight < 1) || (data.serviceProvider.maxParcelLength < 1) || (data.serviceProvider.maxParcelWidth < 1) ) {
    db.collection('serviceProvider').deleteOne(
      { "_id": ObjectId(data.serviceProvider._id) },
      function(err, results) {
        if (err) return console.log(err);
        console.log("Deleted from serviceProvider");
        db.collection('serviceProvided').insertOne( data.serviceProvider, function(err, results) {
          console.log('saved to serviceProvided');
        });
      });
  }else {
    db.collection('serviceProvider').updateOne(
      { "_id": ObjectId(data.serviceProvider._id) },
      {
        $set: { "maxParcelWeight": data.serviceProvider.maxParcelWeight, "maxParcelHeight": data.serviceProvider.maxParcelHeight, "maxParcelLength": data.serviceProvider.maxParcelLength, "maxParcelWidth": data.serviceProvider.maxParcelWidth },
      }, function(err, results) {
        if (err) return console.log(err);
        console.log('updated serviceProvider');
        db.collection('serviceProvided').insertOne( data.serviceProvider, function(err, results) {
          console.log('saved to serviceProvided');
        });
      });
  }
  });
};

var getServiceProviderList = function (parcelDetails,  sendResponse) {
  responseToSender = [];
  if (parcelDetails._id != null){
    parcelDetails._id = ObjectId(parcelDetails._id);
  }
  console.log(new Date().toISOString().split('T')[0]);
  var cursorone = db.collection('serviceProvider')
    .find({$and: [ {$or:[{"currentCity": parcelDetails.currentCity}, {"itineraryCitiesToDestination.city": parcelDetails.currentCity}]}, {$or:[{"destinationCity": parcelDetails.deliveryCity}, {"itineraryCitiesToDestination.city": parcelDetails.deliveryCity}]}, {"maxParcelWeight": { $gte: (parcelDetails.parcelWeight) }}, {"maxParcelHeight": { $gte: (parcelDetails.parcelHeight)}}, {"maxParcelLength": { $gte: (parcelDetails.parcelLength)}}, {"maxParcelWidth": { $gte: (parcelDetails.parcelWidth)}}, {"journeyDate" : {$gte: parcelDetails.startDeliveryDate,  $lte: parcelDetails.endDeliveryDate}}, {"journeyDate" : {$gte: new Date().toISOString().split('T')[0]}}]}).sort({maxParcelWeight: + 1});

  cursorone.count(function (e, count) {

    if (count === 0) {
      db.collection('parcelSender').save(parcelDetails, function(err, result){
        if (err) return console.log(err);
      responseToProvider = [];
      sendResponse(responseToSender);
      //sendRaisedEmailToProvider(data);
      console.log("saved to parcelSender");
    })
    }else {
      cursorone.each(function(err, provider){
        if (provider !== null && provider !== undefined){
            // if (provider.currentCity === parcelDetails.currentCity || parcelDetails.nearByCitiesArray.indexOf(sender.currentCity) >= 0){
            //   if (sender.deliveryCity === parcelDetails.deliveryCity){
            //     responseToSender.push(sender);
            //   }else {
            //     for (var i in parcelDetails.itineraryCitiesToDestination){
            //       if (parcelDetails.itineraryCitiesToDestination[i].city === sender.deliveryCity){
            //         responseToSender.push(sender);
            //       }
            //     }
            //   }
            // }else {
            //   for (var index in parcelDetails.itineraryCitiesToDestination){
            //     if (parcelDetails.itineraryCitiesToDestination[index].city === sender.currentCity){
            //       if (parcelDetails.destinationCity === sender.deliveryCity){
            //         responseToSender.push(sender);
            //       }else {
            //         for (var i in parcelDetails.itineraryCitiesToDestination){
            //           if (parcelDetails.itineraryCitiesToDestination[i].city === sender.deliveryCity){
            //             if (parcelDetails.itineraryCitiesToDestination[index].index <= parcelDetails.itineraryCitiesToDestination[i].index){
            //               responseToSender.push(sender);
            //             }
            //           }
            //         }
            //       }
            //     }
            //   }
            // }
          responseToSender.push(provider);
          count--;
          if (count === 0){
            sendResponse(responseToSender);
            cursorone.close();
          }
        }
      })
    }
  })
};

var getParcelSenderList = function (serviceDetails,  sendResponse) {
  responseToSender = [];
  var connectingCitiesToDestination = [];
  var connectingCitiesToReturn = [];
  if (serviceDetails._id != null){
    serviceDetails._id = ObjectId(serviceDetails._id);
  }
  if (serviceDetails.itineraryCitiesToDestination){
    for (var index in serviceDetails.itineraryCitiesToDestination){
      connectingCitiesToDestination.push(serviceDetails.itineraryCitiesToDestination[index].city);
    }
  }
  if (serviceDetails.itineraryCitiesToCurrent){
    for (var index in serviceDetails.itineraryCitiesToCurrent){
      connectingCitiesToReturn.push(serviceDetails.itineraryCitiesToCurrent[index].city);
    }
  }
  var cursorone = db.collection('parcelSender')
      .find( {$and: [{$or: [{ "currentCity": serviceDetails.currentCity} , { "currentCity": { $in: connectingCitiesToDestination}}, { "currentCity": { $in: serviceDetails.nearByCitiesArray}}]}, {$or: [{ "deliveryCity": serviceDetails.destinationCity} ,{ "deliveryCity": { $in: connectingCitiesToDestination}}]}, {"parcelWeight": { $lte: (serviceDetails.maxParcelWeight)}}, {"parcelHeight": { $lte: (serviceDetails.maxParcelHeight)}}, {"parcelLength": { $lte: (serviceDetails.maxParcelLength)}}, {"parcelWidth": { $lte: (serviceDetails.maxParcelWidth)}}, {"startDeliveryDate" : {$lte: serviceDetails.journeyDate}}, {"endDeliveryDate" : {$gte: serviceDetails.journeyDate}}]}).sort({parcelWeight: -1})
  cursorone.count(function (e, count) {
    if (count === 0) {
      db.collection('serviceProvider').save(serviceDetails, function(err, result){
        if (err) return console.log(err);
      responseToProvider = [];
      sendResponse(responseToSender);
      //sendRaisedEmailToProvider(data);
      console.log("saved to serviceProvider");
    })
    }else {
      cursorone.each(function(err, sender){
        if (sender !== null && sender !== undefined){
          if (sender.currentCity === serviceDetails.currentCity || serviceDetails.nearByCitiesArray.indexOf(sender.currentCity) >= 0){
            if (sender.deliveryCity === serviceDetails.destinationCity){
              responseToSender.push(sender);
            }else {
              for (var i in serviceDetails.itineraryCitiesToDestination){
                if (serviceDetails.itineraryCitiesToDestination[i].city === sender.deliveryCity){
                    responseToSender.push(sender);
                }
              }
            }
          }else {
            for (var index in serviceDetails.itineraryCitiesToDestination){
              if (serviceDetails.itineraryCitiesToDestination[index].city === sender.currentCity){
                if (serviceDetails.destinationCity === sender.deliveryCity){
                  responseToSender.push(sender);
                }else {
                  for (var i in serviceDetails.itineraryCitiesToDestination){
                    if (serviceDetails.itineraryCitiesToDestination[i].city === sender.deliveryCity){
                      if (serviceDetails.itineraryCitiesToDestination[index].index <= serviceDetails.itineraryCitiesToDestination[i].index){
                        responseToSender.push(sender);
                      }
                    }
                  }
                }
              }
            }
          }
          count--;
          if (count === 0){
            sendResponse(responseToSender);
            cursorone.close();
          }
        }
      })
    }
  })
};

var sendRaisedEmailToSender = function (sender) {

  var subject = "Parcel Request Raised for the Item " + sender.parcelDisclosure;
  var content = "You have successfully raised the Parcel request for the Item " + sender.parcelDisclosure + " \n " +
    "Parcel Capacity Mentioned: \n" +
    "Max. Parcel Weight: " + sender.maxParcelWeight + " pounds" + " \n " + "Max. Parcel Height: " + sender.maxParcelHeight + " cm." + " \n " + "Max. Parcel Length: " + sender.maxParcelLength+ " cm." + " \n " + "Max. Parcel Width: " + sender.maxParcelWidth+ " cm." + " \n\n\n " +
    "Team\nMeet-the-Need";
  sendEmail(sender.senderEmail, subject, content);

}

var sendRaisedEmailToProvider = function (provider) {
  var subject = "Service Request Raised for the Travel to " + provider.destinationCity + " on "+ provider.journeyDate;
  var content = "You have successfully raised the service request for the travel to " + provider.destinationCity + " on " + provider.journeyDate + " \n " +
    "Parcel Capacity Mentioned: \n" +
    "Max. Parcel Weight: " + provider.maxParcelWeight + " pounds" + " \n " + "Max. Parcel Height: " + provider.maxParcelHeight + " cm." + " \n " + "Max. Parcel Length: " + provider.maxParcelLength+ " cm." + " \n " + "Max. Parcel Width: " + provider.maxParcelWidth+ " cm." + " \n\n\n " +
    "Team\nMeet-the-Need";
  sendEmail(provider.email, subject, content);

};

var sendRaisedEmailToReceiver = function (sender) {

  var subject = "Parcel " + sender.parcelDisclosure + " is requested to delivery to you";
  var content = "Parcel " + sender.parcelDisclosure + " is successfully requested to delivery to you" + " \n " +
    "Assigned Parcel Details: \n " +
    "Parcel Description: "+ sender.parcelDisclosure + "Parcel Weight: " + sender.parcelWeight + " pounds" + " \n " + "Parcel Height: " + sender.parcelHeight + " cm." + " \n " + "Parcel Length: " + sender.parcelLength+ " cm." + " \n " + "Parcel Width: " + sender.parcelWidth+ " cm." + " \n\n\n " +
    "Sender Details: \nName : " + sender.senderName + " \n " + "Email : " + sender.senderEmail + " \n " + "Phone : " + sender.senderPhone + " \n " +
    "Address :\n " + sender.currentAddreddaddressLine1 + " \n " + sender.currentAddreddaddressLine2 + " \n " + "City : " + sender.currentCity + " \n " + "State : " + sender.currentState + " \n " + "Zip : " + sender.currentZip + " \n " +
    "Team\nMeet-the-Need";
  sendEmail(sender.receiverEmail, subject, content);

};

var sendAssignedEmailToSender = function (sender, provider) {
  var subject = "Service Provider is Assigned for the Parcel Request  for Item " + sender.parcelDisclosure;
  var content = "Service Provider is successfully assigned for the Parcel Request  for Item " + sender.parcelDisclosure +
    "Parcel Description: "+ sender.parcelDisclosure + "Parcel Weight: " + sender.parcelWeight + " pounds" + " \n " + "Parcel Height: " + sender.parcelHeight + " cm." + " \n " + "Parcel Length: " + sender.parcelLength+ " cm." + " \n " + "Parcel Width: " + sender.parcelWidth+ " cm." + " \n\n\n " +
    "Assigned Service Provider Details:\n" +
    "Name : " + provider.name + " \n " + "Email : " + provider.email + " \n " + "Phone : " + provider.phone + " \n " +
    "Current Address :\n " + provider.currentAddreddaddressLine1 + " \n " + provider.currentAddreddaddressLine2 + " \n " + "City : " + provider.currentCity + " \n " + "State : " + provider.currentState + " \n " + "Zip : " + provider.currentZip + " \n " +
    "Destination Address :\n " + provider.destinationAddreddaddressLine1 + " \n " + provider.destinationAddreddaddressLine2 + " \n " + "City : " + provider.destinationCity + " \n " + "State : " + provider.destinationState + " \n " + "Zip : " + provider.destinationZip + " \n\n\n " +
    "Team\nMeet-the-Need";
  sendEmail(sender.senderEmail, subject, content);

};



var sendAssignedEmailToProvider = function (sender, provider) {
  var subject = "Parcel Request Assigned for the Travel to " + provider.destinationCity + " on "+ provider.journeyDate;
  var content = "Parcel Request is successfully assigned for the travel to " + provider.destinationCity + " on " + provider.journeyDate + " \n " +
    "Assigned Parcel Details: \n" +
    "Parcel Description: "+ sender.parcelDisclosure + "\nParcel Weight: " + sender.parcelWeight + " pounds" + " \n " + "Parcel Height: " + sender.parcelHeight + " cm." + " \n " + "Parcel Length: " + sender.parcelLength+ " cm." + " \n " + "Parcel Width: " + sender.parcelWidth+ " cm." + " \n\n\n " +
    "Sender Details: \nName : " + sender.senderName + " \n " + "Email : " + sender.senderEmail + " \n " + "Phone : " + sender.senderPhone + " \n " +
    "Address :\n " + sender.currentAddreddaddressLine1 + " \n " + sender.currentAddreddaddressLine2 + " \n " + "City : " + sender.currentCity + " \n " + "State : " + sender.currentState + " \n " + "Zip : " + sender.currentZip + " \n " +
    "Receiver Details: \nName : " + sender.receiverName + " \n " + "Email : " + sender.receiverEmail + " \n " + "Phone : " + sender.receiverPhone + " \n " +
    "Address :\n " + sender.deliveryAddreddaddressLine1 + " \n " + sender.deliveryAddreddaddressLine2 + " \n " + "City : " + sender.deliveryCity + " \n " + "State : " + sender.deliveryState + " \n " + "Zip : " + sender.deliveryZip + " \n " +
    "Team\nMeet-the-Need";
  sendEmail(provider.email, subject, content);

};

var sendAssignedEmailToReceiver = function (sender, provider) {
  var subject = "Service Provider is Assigned for Parcel Item " + sender.parcelDisclosure + " to Deliver to You";
  var content = "Service Provider is Successfully Assigned for Parcel Item " + sender.parcelDisclosure + " to Deliver to You" + " \n " +
    "Assigned Parcel Details: \n " +
    "Parcel Description: "+ sender.parcelDisclosure + "Parcel Weight: " + sender.parcelWeight + " pounds" + " \n " + "Parcel Height: " + sender.parcelHeight + " cm." + " \n " + "Parcel Length: " + sender.parcelLength+ " cm." + " \n " + "Parcel Width: " + sender.parcelWidth+ " cm." + " \n\n\n " +
    "Sender Details: \nName : " + sender.senderName + " \n " + "Email : " + sender.senderEmail + " \n" + "Phone : " + sender.senderPhone + " \n" +
    "Address :\n " + sender.currentAddreddaddressLine1 + " \n " + sender.currentAddreddaddressLine2 + " \n " + "City : " + sender.currentCity + " \n " + "State : " + sender.currentState + " \n " + "Zip : " + sender.currentZip + " \n " +
    "Assigned Service Provider Details:\n" +
    "Name : " + provider.name + " \n " + "Email : " + provider.email + " \n " + "Phone : " + provider.phone + " \n " +
    "Current Address :\n " + provider.currentAddreddaddressLine1 + " \n " + provider.currentAddreddaddressLine2 + " \n " + "City : " + provider.currentCity + " \n " + "State : " + provider.currentState + " \n " + "Zip : " + provider.currentZip + " \n " +
    "Destination Address :\n " + provider.destinationAddreddaddressLine1 + " \n " + provider.destinationAddreddaddressLine2 + " \n " + "City : " + provider.destinationCity + " \n " + "State : " + provider.destinationState + " \n " + "Zip : " + provider.destinationZip + " \n\n\n " +
    "Team\nMeet-the-Need";
  sendEmail(sender.receiverEmail, subject, content);

};

var assignedServiceRequest = function (data, callback) {
  var assignedServiceRequests = [];
  if (data.status){
    var cursor = db.collection('providerAssigned').find({$and: [{ "serviceProvider.email": data.email}, {"status": data.status}]});
    cursor.each(function(err, request){
      if (request !== null) {
        assignedServiceRequests.push(request);
      }else {
        callback(assignedServiceRequests)
      }
    })
  }else {
    var cursor = db.collection('providerAssigned').find({ "serviceProvider.email": data.email});
    cursor.each(function(err, request){
      if (request !== null) {
        assignedServiceRequests.push(request);
      }else {
        callback(assignedServiceRequests)
      }
    })
  }
};

var unassignedServiceRequest = function (data, callback) {
  var unassignedServiceRequests = [];
  var cursor = db.collection('serviceProvider').find( { "email": data.email} );
  cursor.each(function(err, request){
    if (request !== null) {
      unassignedServiceRequests.push(request);
    }else {
      callback(unassignedServiceRequests)
    }
  })
};

var assignedSenderRequest = function (data, callback) {
  var assignedServiceRequests = [];
  if (data.status){
    var cursor = db.collection('providerAssigned').find( {$and: [{ "senderEmail": data.email}, {"status": data.status}]});
    cursor.each(function(err, request){
      if (request !== null) {
        assignedServiceRequests.push(request);
      }else {
        callback(assignedServiceRequests)
      }
    })
  }else {
    var cursor1 = db.collection('providerAssigned').find( { "senderEmail": data.email} );
    cursor1.each(function(err, request){
      if (request !== null) {
        assignedServiceRequests.push(request);
      }else {
        // var cursor2 = db.collection('parcelSender').find( { "senderEmail": data.email} );
        // cursor2.each(function(err, request){
        //   if (request !== null) {
        //     assignedServiceRequests.push(request);
        //   }else {
        //     callback(assignedServiceRequests)
        //   }
        // });
        callback(assignedServiceRequests);
      }
    })
  }

};

var unassignedSenderRequest = function (data, callback) {
  var unassignedServiceRequests = [];
  var cursor = db.collection('parcelSender').find( { "senderEmail": data.email} );
  cursor.each(function(err, request){
    if (request !== null) {
      unassignedServiceRequests.push(request);
    }else {
      callback(unassignedServiceRequests)
    }
  })
};


var parcelReceivingRequest = function (data, callback) {
  var parcelReceivingRequests = [];
  if (data.status){
    var cursor = db.collection('providerAssigned').find( {$and: [{ "receiverEmail": data.email}, {"status": data.status}]} );
    cursor.each(function(err, request){
      if (request !== null) {
        parcelReceivingRequests.push(request);
      }else {
        callback(parcelReceivingRequests)
      }
    }) 
  }else {
    var cursor = db.collection('providerAssigned').find( { "receiverEmail": data.email} );
    cursor.each(function(err, request){
      if (request !== null) {
        parcelReceivingRequests.push(request);
      }else {
        callback(parcelReceivingRequests)
      }
    })
  }
};

var parcelStatusChange = function (data, callback) {
  var cursor = db.collection('providerAssigned').find( { "_id": ObjectId(data.parcelId)} );
  cursor.each(function(err, parcel){
    if (parcel !== null) {
      var status='';
      var setObject;
      if (parcel.senderEmail === data.email){
        var role = "Sender";
        if (parcel.status === "Pending Approval At Parcel Sender"){
          status = "Assigned To Service Provider";
          setObject= { "status": status, 'finalCharge': parcel.serviceProvider.expectedParcelDeliveryCharge };
        }else if (parcel.status === "Assigned To Service Provider"){
          status = "Parcel Given To Service Provider";
          setObject= { "status": status};
        }
      }else if (parcel.serviceProvider.email === data.email){
        role = "Provider";
        if (parcel.status === "Parcel Given To Service Provider"){
          status = "Parcel Collected From Sender";
          setObject= { "status": status};
        }else if (parcel.status === "Parcel Collected From Sender"){
          status = "Parcel Delivered To Receiver";
          setObject= { "status": status};
        }else if (parcel.status === "Pending Approval At Service Provider"){
          status = "Assigned To Service Provider";
          setObject= { "status": status, 'finalCharge': parcel.expectedParcelDeliveryCharge };
        }
      }else if (parcel.receiverEmail === data.email){
        if (parcel.finalCharge) {
          chargeCard(data.parcelId, parcel.senderEmail, parcel.finalCharge)
        }
        role = "Receiver";
        status = "Parcel Received From Service Provider";
        setObject= { "status": status};
      }
      db.collection('providerAssigned').updateOne(
        { "_id": ObjectId(data.parcelId)},
        {
          $set: setObject,
        }, function(err, results) {
          console.log('status updated');
          sendStatusChangeEmail(parcel, status)
          callback({role: role, status: status});
        });
    }
  });
};

var sendStatusChangeEmail = function (data, status) {
  var subject = "Status of Request changed to " + status;
  var content = "Status of Request changed to " + status + " for parcel Item " + data.parcelDisclosuren + " \n " +
    "Assigned Parcel Details: \n " +
    "Parcel Description: "+ data.parcelDisclosure + "Parcel Weight: " + data.parcelWeight + " pounds" + " \n " + "Parcel Height: " + data.parcelHeight + " cm." + " \n " + "Parcel Length: " + data.parcelLength+ " cm." + " \n " + "Parcel Width: " + data.parcelWidth+ " cm." + " \n\n\n " +
    "Sender Details: \nName : " + data.senderName + " \n " + "Email : " + data.senderEmail + " \n " + "Phone : " + data.senderPhone + " \n" +
    "Address :\n " + data.currentAddreddaddressLine1 + " \n " + data.currentAddreddaddressLine2 + " \n " + "City : " + data.currentCity + " \n " + "State : " + data.currentState + " \n " + "Zip : " + data.currentZip + " \n " +
    "Assigned Service Provider Details:\n " +
    "Name : " + data.serviceProvider.name + " \n " + "Email : " + data.serviceProvider.email + " \n " + "Phone : " + data.serviceProvider.phone + " \n " +
    "Current Address :\n " + data.serviceProvider.currentAddreddaddressLine1 + " \n " + data.serviceProvider.currentAddreddaddressLine2 + " \n " + "City : " + data.serviceProvider.currentCity + " \n " + "State : " + data.serviceProvider.currentState + " \n " + "Zip : " + data.serviceProvider.currentZip + " \n " +
    "Destination Address :\n " + data.destinationAddreddaddressLine1 + " \n " + data.destinationAddreddaddressLine2 + " \n " + "City : " + data.destinationCity + " \n " + "State : " + data.destinationState + " \n " + "Zip : " + data.destinationZip + " \n\n\n " +
    "Receiver Details: \nName : " + data.receiverName + " \n " + "Email : " + data.receiverEmail + " \n " + "Phone : " + data.receiverPhone + " \n" +
    "Address :\n " + data.deliveryAddreddaddressLine1 + " \n " + data.deliveryAddreddaddressLine2 + " \n " + "City : " + data.deliveryCity + " \n " + "State : " + data.deliveryState + " \n " + "Zip : " + data.deliveryZip + " \n " +
    "Team\nMeet-the-Need";
  sendEmail(data.serviceProvider.email, subject, content);
  sendEmail(data.senderEmail, subject, content);
  sendEmail(data.receiverEmail, subject, content);

};

var getServiceProviderDetails = function (data, callback) {
  var serviceProviderDetails = [];
  if (data.id != null){
    var cursor = db.collection('serviceProvider').findOne( { "_id": ObjectId(data.id)}, function (err, document) {
      serviceProviderDetails.push(document);
      callback(serviceProviderDetails)
    })
  } else {
    var cursor = db.collection('providerAssigned').findOne( { "serviceProvider.email": data.email}, function (err, document) {
      if (document !== null){
        serviceProviderDetails.push(document);
        callback(serviceProviderDetails)
      }else {
        var cursor = db.collection('serviceProvider').findOne( { "email": data.email}, function (err, document) {
          serviceProviderDetails.push(document);
          callback(serviceProviderDetails)
        })
      }
    } );
  }
};


var getParcelSenderDetails = function (data, callback) {
  var parcelSenderDetails = [];
  var cursor = db.collection('parcelSender').findOne( { "senderEmail": data.email}, function (err, document) {
    if (document !== null){
      parcelSenderDetails.push(document);
      callback(parcelSenderDetails)
    }else {
      var cursor = db.collection('providerAssigned').findOne( { "senderEmail": data.email}, function (err, document) {
        parcelSenderDetails.push(document);
        callback(parcelSenderDetails)
      })
    }
  } );
};

var cancelRequest = function (data, callback) {
  if (data.requestType == 'Service'){
    db.collection('serviceProvider').deleteOne(
      { "_id": ObjectId(data.requestId) },
      function(err, results) {
        console.log('deleted from serviceProvider');
        if (callback){
          callback({role: 'Service'});
        }
      })
  }
  if (data.requestType == 'Parcel') {
    db.collection('parcelSender').deleteOne(
      { "_id": ObjectId(data.requestId) },
      function(err, results) {
        console.log('deleted from parcelSender');
        if (callback){
          callback({role: 'Parcel'});
        }
      })
  }
};

var updateRequest = function (data, callback) {
  var response = [];
  if (data.requestType == 'Service'){
    db.collection('serviceProvider').findOne({"_id": ObjectId(data.requestId)}, function(err, provider) {
      response.push(provider);
      callback(response);
      cancelRequest(data);
    });
  }
  if (data.requestType == 'Parcel') {
    db.collection('parcelSender').findOne({"_id": ObjectId(data.requestId)}, function(err, sender) {
      response.push(sender);
      callback(response);
      cancelRequest(data);
    });
  }
};

var rejectRequest = function (data, callback) {
  db.collection('providerAssigned').findOne({"_id": ObjectId(data.requestId)}, function (err, request) {
      if (request['_id']){
        delete request['_id'];
      }
      db.collection('serviceProvider').insertOne(
        request.serviceProvider,
        function(err, results) {
          delete request['serviceProvider'];
          delete request['status'];
          db.collection('parcelSender').insertOne(
            request,
            function(err, results) {
              if (callback){
                if (data.requestType == 'Service')
                  callback({role: 'Service'});
                else if (data.requestType == 'Parcel')
                  callback({role: 'Parcel'});
              }
              db.collection('providerAssigned').deleteOne({"_id": ObjectId(data.requestId)})
            })
        })
  });
};

var sendEmail = function (to_emailId, email_subject, content_text) {
  // var from_email = new helper.Email("no-reply@meet-the-need.com")
  // var to_email = new helper.Email(to_emailId)
  // var subject = email_subject;
  // var content = new helper.Content("text/plain", content_text)
  // var mail = new helper.Mail(from_email, subject, to_email, content)
  //
  // var sg = require('sendgrid').SendGrid('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')
  // var requestBody = mail.toJSON()
  // var request = sg.emptyRequest()
  // request.method = 'POST'
  // request.path = '/v3/mail/send'
  // request.body = requestBody
  // sg.API(request, function (response) {
  //   console.log(response.statusCode)
  //   console.log(response.body)
  //   console.log(response.headers)
  // })

};
const express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');
const Contact = require('../models/contact');

const router = express.Router();

router.get('/', (req, res, next) => {
  Message.find()
    .populate('sender')
    .lean()
    .then(messages => {
      res.status(200).json(messages.map(
          message => {
            delete message._id;
            message.sender = message.sender.id;
            return message;
          }
        )
      );
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occured',
        error: error
      });
    });
});

router.post('/', (req, res, next) => {
  Contact.findOne({ id: req.body.sender })
    .then(contact => {
      const newMessage = new Message({
        id: sequenceGenerator.nextId('messages'),
        subject: req.body.subject,
        msgText: req.body.msgText,
        sender: contact._id
      });
      newMessage.save()
        .then(createdMessage => {
          res.status(201).json({
            message: 'Message added successfully',
            createdMessage: createdMessage
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Contact not found',
        error: { message: 'Contact not found' }
      });
    });
});

module.exports = router; 
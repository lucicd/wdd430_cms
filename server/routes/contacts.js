const express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');

const router = express.Router();

function saveContact(contact, res) {
  console.log(contact);
  contact.save()
    .then(createdContact => {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
}

function updateContact(contact, res) {
  Contact.updateOne({ id: contact.id }, contact)
    .then(result => {
      res.status(204).json({
        message: 'Contact updated successfully'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occured',
        error: error
      });
    });
}

function getObjectIdForGroups(contact, group, res, callback) {
  let itemsProcessed = 0;
  let newGroup = [];
  group.forEach((item, index, array) => {
    Contact.findOne({ id: item.id })
      .then(groupContact => {
        newGroup.push(groupContact);
        itemsProcessed++;
        if (itemsProcessed === array.length) {
          contact.group = newGroup;
          callback();
        }
      })
      .catch(error => {
        res.status(500).json({
          message: 'Group contact not found',
          error: { message: 'Group contact not found' }
        });
      });
  });
}

router.get('/', (req, res, next) => {
  Contact.find()
    .populate('group')
    .lean()
    .then(contacts => {
      res.status(200).json(contacts.map(
          contact => {
            delete contact._id;
            if (contact.group) {
              contact.group.map(
                groupContact => {
                  delete groupContact._id;
                  return groupContact;
                }
              );
            }
            return contact;
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
  const contact = new Contact({
    id: sequenceGenerator.nextId('contacts'),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl
  });

  if (req.body.group && req.body.group.length > 0) {
    getObjectIdForGroups(contact, req.body.group, res, () => {
      saveContact(contact, res);
    });
  } else {
    saveContact(contact, res);
  }
});

router.put('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;

      if (req.body.group) {
        getObjectIdForGroups(contact, req.body.group, res, () => {
          updateContact(contact, res);
        });
      } else {
        updateContact(contact, res);
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found'}
      });
    });
});


router.delete('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      Contact.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: 'Contact deleted successfully'
          });
        })
        .catch(error => {
           res.status(500).json({
           message: 'An error occurred',
           error: error
         });
        })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found'}
      });
    });
});

module.exports = router; 
const mongoose = require('mongoose');
const { resolve } = require('node:path');
const contact = require('./server/models/contact');

mongoose.connect('mongodb://localhost:27017/cms',
  { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) {
      console.log('Connection failed: ' + err);
    }
    else {
      console.log('Connected to database!');
    }
  }
);

const messageSchema = mongoose.Schema({
  id: { type: String, required: true},
  subject: { type: String },
  msgText: { type: String, required: true },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contact',
    required: true
  }
});

const contactSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, reqired: true },
  phone:  { type: String },
  imageUrl: { type: String },
  group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }]
});

const Message = mongoose.model('Message', messageSchema);
const Contact = mongoose.model('Contact', contactSchema);

function getSenderObject(senderId) {
  return new Promise((resolve, reject) => {
    Contact.findOne({ id: senderId })
      .then(senderObject => resolve(senderObject))
      .catch(error => reject(error));
  });
}

// Message.findOne({ id: '1' })
//   .populate({ path: 'sender', select: 'id' })
//   .lean()
//   .then(message => {
//     delete message._id;
//     message.sender = message.sender.id;
//     console.log(message);
//     getSenderObject(message.sender)
//       .then(
//         function(senderObject) {
//           message.sender = senderObject;
//           console.log(message);
//           process.exit(0);
//         }, 
//         function(error) {
//           console.log(error);
//           process.exit(1);
//         }
//       );
//   });

const message = new Message({
  id: '200',
  subject: 'test',
  msgTex: 'test',
  sender: '7'
});

const contactObject = message.aggregate.lookup({ 
  from: 'contacts',
  localField: 'sender',
  foreignField: 'id',
  as: 'sender'
});

contactObject.exec();
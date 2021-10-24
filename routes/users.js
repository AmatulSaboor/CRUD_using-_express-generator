var express = require('express');
var router = express.Router();
const {MongoClient, ObjectId} = require('mongodb');
const uri = 'mongodb+srv://Admin:admin123@cluster0.vzs9g.mongodb.net/myDB?retryWrites=true&w=majority';
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

/* GET home page. */
router.get('/', (req, res) => {
  client.connect(async (err) => {
    if (err) throw err;
    const usersCollection = client.db('myDB').collection('UsersCollection');
    const userData = await usersCollection.find({}).toArray();
    res.render('./index.ejs', {userData});
  });
});

router.post('/add', (req, res) => {
  console.log('inside users add');
  client.connect(async (err) => {
    if (err) throw err;
    const usersCollection = client.db('myDB').collection('UsersCollection');
    // using async await
    const result = await usersCollection.insertOne(req.body);
    if (result.acknowledged) {
      console.log(result.insertedCount + ` document inserted successfully!`);
    } else {
      console.log(`There was an error in inserting the document`);
    }
    res.redirect('/');
  });
});

// ============================== delete ======================================
router.get('/delete/:userId', (req, res) => {
  console.log('inside users delete');
  client.connect((err) => {
    if (err) throw err;
    const usersCollection = client.db('myDB').collection('UsersCollection');
    // using promise
    usersCollection.deleteOne({'_id': new ObjectId(req.params.userId)}).then(result => console.log(result)).catch( err => console.log(err));
      res.redirect('/');
    });
  });

// ============================== update ======================================
router.post('/edit', (req, res) =>{
  console.log('inside users update');
  console.log(req.body);
  client.connect(err => {
    if (err) throw err;
    const usersCollection = client.db('myDB').collection('UsersCollection');
    // using callback
    usersCollection.updateOne({'_id': new ObjectId(req.body._id)}, {$set: {'name':req.body.name, 'email':req.body.email, 'address':req.body.address, 'phone':req.body.phone}}, (err, result) => {
      if (err) throw err;
      if (result.acknowledged) {
        console.log(result.updatedCount + ' document updated successfully!');
      } else {
        console.log('There was an error in updating the document');
      }
      res.redirect('/');
    });
  });
});

module.exports = router;

import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import Issue from './models/issue'

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/issues');

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB connection established sucessfully!')
});

router.route('/issues').get((req, res) => {
    Issue.find((err, issues) => {
        if (err) console.log(err)
        else res.json(issues)
    });
});

router.route('/issues/:id').get((req, res) => {
    Issue.findById(req.params.id, (err, issues) => {
        if (err) console.log(err)
        else res.json(issues)
    });
});

router.route('/issues/add').post((req, res) => {
    let issue = new Issue(req.body);
    issue.save()
        .then(issue => res.status(200).json({ 'issue': 'added sucessfully' }))
        .catch(err => res.status(400).send('fail'))
});

router.route('/issues/update/:id').post((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (!issue)
            return next(new Error('cant find doc'));
        else {
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;

            issue.save()
                .then(issue => res.json('updated'))
                .catch(err => res.status(400).send('update failed'))
        }
    });
});





router.route('/issues/delete/:id').get((req, res) => {
    Issue.findByIdAndRemove({ _id: req.params.id }, (err, issue) => {
        if (err) console.log(err)
        else res.json('removed')
    })

});

app.use("/", router);

app.listen(4000, () => console.log('express server running on port 4000'));
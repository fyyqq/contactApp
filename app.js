
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const { body, validationResult, check } = require('express-validator');
// require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(expressLayout);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Home',
        layout: 'layout/main-layout'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        layout: 'layout/main-layout'
    });
});

app.route('/contact')
.get(async (req, res) => {
    const contacts = await Contact.find()
    res.render('contact', {
        title: 'Contact',
        layout: 'layout/main-layout',
        contacts
    });
}).post([
    body('name').custom(async (value) => {
        const duplicate = await Contact.findOne({ name: value });
        if (duplicate) {
            throw new Error(`${value} has been used. Use another name`);
        } return true;
    }),
    check('email', 'Email Address is Invalid. Try another email').isEmail(),
    check('pass', 'Weak Password.').isStrongPassword()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(404).json({ errors: errors.array() });
        res.render('add', {
            title: 'Contact',
            layout: 'layout/main-layout',
            errors: errors.array()
        });
    } else {
        await Contact.insertMany(req.body);
        console.log(req.body);
        res.redirect('/contact');
    }
});

app.get('/contact/detail/:name', async (req, res) => {
    const contact = await Contact.findOne({ name: req.params.name });
    res.render('details', {
        title: 'Detail Contact',
        layout: 'layout/main-layout',
        contact
    });
});

app.delete('/contact', async (req, res) => {
    await Contact.deleteOne({ name: req.body.name });
    res.redirect('/contact');
});

app.get('/edit/:name', async (req, res) => {
    const contact = await Contact.findOne({ name: req.params.name });
    res.render('edit', {
        title: 'Edit Contact',
        layout: 'layout/main-layout',
        contact
    });
});

app.put('/contact', 
[
    body('name').custom(async (value) => {
        const duplicate = await Contact.findOne({ name: value });
        if (duplicate) {
            throw new Error(`${value} has been used. Use another name`);
        } return true;
    }),
    check('email', 'Email Address is Invalid. Try another email').isEmail(),
    check('pass', 'Weak Password.').isStrongPassword()
], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('edit', {
            title: 'Edit Contact',
            layout: 'layout/main-layout',
            errors: errors.array()
        });
    } else {
        const id = await Contact.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    pass: req.body.pass
                }
            }
        );
        console.log(req.body);
        res.redirect('/contact');
    }
});

app.get('/contact/add', (req, res) => {
    res.render('add', {
        title: 'Add Contact',
        layout: 'layout/main-layout'
    });
});

app.use((req, res) => {
    res.status(404);
    res.send(`<h1>ERROR 404</h1>`);
});

app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
});
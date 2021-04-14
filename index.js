const express = require('express');
const fs = require('fs');
const app = express();
const { v4: uuidv4 } = require('uuid');
const formidable = require('formidable');
const date = require('date-and-time');
const readingTime = require('./main');
const infos = require('./infos.json');
app.use(express.static('public'));
app.use(express.static('uploads'));
app.listen(3000, () => {
    console.log('listening at http://localhost:3000')
})
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('pages/index',
        {
            title: 'Homepage',
            data: infos
        })
})
app.get('/newArticle', (req, res) => {
    res.render('pages/newArticle',
        {
            title: 'newArticle',
            data: infos
        })
})
app.get('/articleDetails', (req, res) => {
    res.render('pages/articleDetails',
        {
            title: 'articleDetails',
            data: infos
        })
})
app.get('/index/:id', (req, res) => {
    let art = infos.find(element => element.id == req.params.id)
    console.log(art)
    res.render('pages/articleDetails', {
        title: 'newArticle',
        art
    })
})
app.get('/addNew', (req, res) => {
    res.render('pages/newArticle')
})

app.post('/addNew/new', (req, res, next) => {
    const form = formidable({
        multiples: true,
        keepExtensions: true,
        uploadDir: 'uploads'
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        console.log(req.body);
        const now = new Date();
        //req.body.url_picture,req.body.author_picture
        let newArticle =
        {
            id: uuidv4(),
            url: `/${files.url_picture.path.slice('uploads'.length)}`,
            title: fields.title,
            body: fields.text_blog,
            published_at: date.format(now, 'MMM DD YYYY'),
            duration: readingTime(fields.text_blog),
            author: fields.author,
            author_bild: `/${files.author_picture.path.slice('uploads'.length)}`

        }
        infos.unshift(newArticle)
        fs.writeFile('./infos.json', JSON.stringify(infos), (err) => {
            if (err) throw err
            fs.readFile('./infos.json', 'utf-8', (err, index) => {
                data = JSON.parse(index)
                res.redirect('/')
            })

        })
    });
})
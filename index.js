const express = require('express');
const app = express();
const infos = require('./infos.json');
app.use(express.static('public'))
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
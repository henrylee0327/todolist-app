const express = require('express')
const app = express()

// serve files out of the public directory
app.use(express.static('public'))

const port = 7878

//set the template engine
app.set('view engine', 'hbs')

const dummyLists = [
    {
        uuid: 'asdffaneifoahf',
        name: 'morning list'
    },
    {
        uuid: 'adsfiuhiqbgqyiu',
        name: 'afternoon list'
    }
]

const dummyItems = [
    {
        uuid: 'rfesgea',
        description: 'Go to office',
        display_order: 1
    },
    {
        uuid: 'fjoiwejf98hqkjnf',
        description: 'Have a meeting',
        display_order: 2
    }
]

//The homepage shows your todolist
app.get('/', function (req, res) {
    res.render('index', {lists: dummyLists})
  })

//The list page shows the items in the List
app.get('/list/:listUUID', function (req, res) {
    res.render('list_page', {listName: 'dummy list', items: dummyItems})
})

app.listen(port, () => {
    console.log('listening port: ' + port)
})


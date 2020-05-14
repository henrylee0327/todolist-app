const express = require('express')
const db = require('./lib/db')

const app = express()

// serve files out of the public directory
app.use(express.static('public'))

const port = 7878

//set the template engine
app.set('view engine', 'hbs')

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

app.param('listUUID', function (req, res, nextFn, listUUID) {
    db.getList(listUUID)
        .then((theList) => {
            req.todolist = req.todolist || {}
            req.todolist.list = theList
            nextFn()
        })
        .catch(() => {
            res.status(404).send('list not found')
        })
})


//The homepage shows your todolist
app.get('/', function (req, res) {
    db.getLists()
        .then((lists) => {
            res.render('index', {lists: lists})
        })
        .catch(() => {
            // TODO show an error page here
        })
  })

//The list page shows the items in the List
app.get('/list/:listUUID', function (req, res) {
    const theList = req.todolist.list
    res.render('list_page', {listName: theList.name, items: dummyItems})
})

const startExpressApp = () => {
    app.listen(port, () => {
        console.log('listening port: ' + port)
    })    
}

const bootupSequenceFailed = (err) => {
    console.error('unable to connect to database: ', err)
        console.error('Good Bye!')
        process.exit(1)
}

// global kickoff point
db.connect()
    // .then(startExpressApp)
    .then(startExpressApp)
    .catch(bootupSequenceFailed)

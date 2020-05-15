const express = require('express')
const db = require('./lib/db')
const validate = require('./lib/validate')

const app = express()

// serve files out of the public directory
app.use(express.static('public'))

app.use(express.urlencoded({extended: true}))

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
    res.render('list_page', {
        listUUID: theList.uuid,
        listName: theList.name, 
        items: theList.items
    })
})

// add a new item to a list
app.post('/list/:listUUID/new-item', function (req, res) {
    const theList = req.todolist.list
    const newDescription = req.body.description
        
    // console.log(req)

    if (validate.validDescription(newDescription)) {
        // create the item
        db.createItem(theList.id, newDescription)
            .then((newItem) => {
            res.render('item_created', {
            listUUID: theList.uuid,
            listName: theList.name, 
            description: newItem.description
                })
            })
            .catch(() => {
                res.status(500).send('oh man, we totally messed up')
            })
        
        // show them the success page
        // res.status(201).send('you did good')
    } else {
        // show them an error page
        res.status(400).send('bad input')
    }

    // const description = 'dummy new item'

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

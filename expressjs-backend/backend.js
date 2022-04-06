const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});      

const users = { 
    users_list :
    [
        { 
            id : 'xyz789',
            name : 'Charlie',
            job: 'Janitor',
        },
        {
            id : 'abc123', 
            name: 'Mac',
            job: 'Bouncer',
        },
        {
            id : 'ppp222', 
            name: 'Mac',
            job: 'Professor',
        }, 
        {
            id: 'yat999', 
            name: 'Dee',
            job: 'Aspring actress',
        },
        {
            id: 'zap555', 
            name: 'Dennis',
            job: 'Bartender',
        }
    ]
}

app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined && job != undefined){
        let result = findUserByNameandJob(name, job);
        result = {users_list: result};
        res.send(result);
    }
    else if (job != undefined){
        let result = findUserByJob(job, users['users_list']);
        result = {users_list: result};
        res.send(result);
    }
    else if (name != undefined){
        let result = findUserByName(name);
        result = {users_list: result};
        res.send(result);
    }
    else{
        res.send(users);
    }
});

const findUserByName = (name) => { 
    return users['users_list'].filter( (user) => user['name'] === name); 
}

const findUserByJob = (job,list) => {
    return list.filter((user) => user['job'] === job);
}

const findUserByNameandJob = (name, job) => {
    return findUserByJob(job, findUserByName(name));
}

app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        result = {users_list: result};
        res.send(result);
    }
});

function findUserById(id) {
    return users['users_list'].find( (user) => user['id'] === id); // or line below
    //return users['users_list'].filter( (user) => user['id'] === id);
}

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.status(201).end();
});

function addUser(user){
    users['users_list'].push(user);
}

function removeUserById(id) {
    index = users['users_list'].indexOf(findUserById(id));
    if(index != -1)
        return users['users_list'].splice(index , 1); 
    return
}

app.delete('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = removeUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    res.status(204).end();
});
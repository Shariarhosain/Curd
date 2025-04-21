const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/users.json');


const readata = () => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const writeData = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));


//create user
exports.createUser = (req, res) => {
    const users = readata();
    console.log(users);
    // Check if the user already exists by email
    const existingUser = users.find(user => user.email === req.body.email);
    console.log(existingUser);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = {id: Date.now(), ...req.body};
    users.push(newUser);
    console.log(users);
    writeData(users);
    res.status(201).json({ message: 'User created successfully', user: newUser });
}

//get all users
exports.getAllUsers = (req, res) => {
    const users = readata();
    res.status(200).json(users);
}

//get user by id
exports.getUserById = (req, res) => {
    const users = readata();
    const user = users.find(user => user.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
}


//update user by id
exports.updateUserById = (req, res) => {
    const users = readata();
    const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    // requested field is not in the user object
    const requestedFields = Object.keys(req.body);
    console.log(requestedFields);
    const userFields = Object.keys(users[userIndex]);
    console.log(userFields);
    const invalidFields = requestedFields.filter(field => !userFields.includes(field));
    console.log(invalidFields);
    if (invalidFields.length > 0) {
        return res.status(400).json({ message: `Invalid fields: ${invalidFields.join(', ')}` });
    }
    users[userIndex] = { ...users[userIndex], ...req.body };
    writeData(users);
    res.status(200).json({ message: 'User updated successfully', user: users[userIndex] });
}


//delete user by id
exports.deleteUserById = (req, res) => {
    const users = readata();
    
    const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    users.splice(userIndex, 1);
    writeData(users);
    res.status(200).json({ message: 'User deleted successfully' });
}
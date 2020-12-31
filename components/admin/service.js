const adminModel = require('./model')
const bcrypt = require('bcrypt')

exports.addNewUser = async (username, email, password) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, salt)
}

exports.getUserByUsernameAndPassword = async (username, password) => {
    let user = await adminModel.getUserByUsernameAndPassword(username, password)

    return user;
}

exports.getUserById = async (id) => {
    return await adminModel.getUserById(id)
}

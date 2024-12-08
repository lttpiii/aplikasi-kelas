const { uuidv7 } = require(`uuidv7`)
const conn = require(`../config/db`)
const response = require(`../response`)
const fs = require(`fs`)
const csv = require(`csv-parser`)
const csvParser = require("csv-parser")
const path = require(`path`)
const express = require("express")
const { deepStrictEqual } = require("assert")
const app = express()

// Sign In
exports.insertUser = (req, res) => {
    const data = {
        idUser: uuidv7(),
        email: req.body.email,
        password: req.body.password
    }

    const query = `INSERT INTO users (idUser, email, password) VALUES (?, ?, ?)`

    conn.query(query,[data.idUser, data.email, data.password] , (err, result) => {
        if(err) throw err

        response(200, data, "Berhasil Menambah Data", "", "", res)
    })
}

// Log In
exports.getUser = (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }

    const query = `SELECT * FROM users WHERE email = ? && password = ?`

    conn.query(query, [data.email, data.password], (err, result) => {
        if(err) throw err

        response(200, result, "Login Berhasil", "", "", res)
    })
}

// Log In Admin
exports.getAdmin = (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }

    const query = `SELECT idUser FROM users WHERE email = ? && password = ?`

    conn.query(query, [data.email, data.password], (err, result) => {
        if(err) throw err
    
        const id = result[0].idUser

        if(id == `01933d29-353d-7bfc-a900-ad33e286068b`){
            response(200, "Admin Mode", "Berhasil Login", "", "", res)
        }else{
            response(500, "Invalid", "Login Gagal", "", "", res)
        }
        
    })
}
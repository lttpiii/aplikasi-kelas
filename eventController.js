const { uuidv7 } = require(`uuidv7`)

const conn = require(`../config/db`)

const response = require(`../response`)

const fs = require(`fs`)

const csv = require(`csv-parser`)
const csvParser = require("csv-parser")

const path = require(`path`)

const express = require("express")
const app = express()

const { deepStrictEqual } = require("assert")

exports.insertEvent = (req, res) => {
    const data = {
        id: uuidv7(),
        buffer: req.file.image,
        message: req.file.message
    }

    const query = `INSERT INTO events (idEvents, gambar, pesan) VALUES (?, ?, ?)`    

    conn.query(query, [data.id, data.buffer, data.message], (err, result) => {
        if(err) throw err

        response(200, `id: ${data.id}`, "Berhasil Menambah Event", "", "", res)
    })
}
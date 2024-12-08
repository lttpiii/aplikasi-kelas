const { uuidv7 } = require(`uuidv7`)
const conn = require(`../config/db`)
const response = require(`../response`)
const fs = require(`fs`)
const csv = require(`csv-parser`)
const csvParser = require("csv-parser")
const path = require(`path`)
const express = require("express")
const app = express()

// Insert Bulk Form CSV
exports.insertDataBulk = (req,res) => {
    // Path ke file CSV
    const filePath = path.join(__dirname, '../source/dataSiswa.csv');

    // Array untuk menyimpan data dari CSV
    const dataArray = [];

    // Membaca file CSV dan memasukkan data ke dalam array
    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        // Menambahkan UUIDv7 sebagai ID untuk setiap baris data
        dataArray.push({
        id: uuidv7(),
            ...row,
        });
    })
    .on('end', () => {
        console.log('Data CSV berhasil dimasukkan ke dalam array.');
        insertDataToDatabase(dataArray);
    })
    .on('error', (err) => {
        console.error('Terjadi kesalahan saat membaca file CSV:', err.message);
    });

    function insertDataToDatabase(data) {
        const query = 'INSERT INTO dataSiswa (idSiswa, absen, nama, umur, pesan) VALUES ?';
      
        // Menyiapkan data dalam format array dua dimensi untuk insert bulk
        const values = data.map(row => [row.id, row.absen, row.name, row.age, row.message]);
      
        // Menjalankan query untuk memasukkan data ke dalam tabel
        conn.query(query, [values], (err, result) => {
          if (err) {
            response(500, err, "Invalid Insert", "", "", res)
          } else {
            response(200, `Banyak Baris : ${result.affectedRows} Baris`, "Berhasil Menambah Data", "", "", res)
          }
          // Menutup koneksi setelah proses selesai
          conn.end();
        });
    }  
}

// Create Data
exports.insertData = (req, res) => {
    const data = {
        idSiswa: uuidv7(),
        absen: req.body.absen,
        name: req.body.name,
        age: req.body.age,
        message: req.body.message,
    }

    const query = `INSERT INTO dataSiswa (idSiswa, absen, nama, umur, pesan) VALUES (?, ?, ?, ?, ?)`

    conn.query(query,[data.idSiswa, data.absen, data.name, data.age, data.message] , (err, result) => {
        if(err) throw err

        response(200, data, "Berhasil Menambah Data", "", "", res)
    })
}
// Edit Data
exports.editData = (req, res) => {
    const absen = req.params.absen;
    const data = {
        absen: req.body.absen,
        name: req.body.name,
        age: req.body.age,
        message: req.body.message
    }
    const query = `UPDATE dataSiswa SET absen = ${data.absen}, nama = ${data.name}, umur = ${data.age}, pesan = ${data.message} WHERE absen = ${absen}`;
    conn.query(query, (err, result) => {
        if(err) throw err
        response(200, data, "Berhasil Update", "", "", res)
    })
}
// Delete Data
exports.deleteData = (req, res) => {
    const absen = req.params.absen

    const query = `DELETE FROM dataSiswa WHERE absen = ${absen}`
    conn.query(query, (err, result) => {
        if(err) throw err
        response(200, "Delete", "Berhasil Menghapus Data", "", "", res)
    })
}
// Get Data By Page
exports.getDataByPage = (req, res) => {
    const { cursor, limit } = req.query

    const pageSize = parseInt(limit) || 10

    let query = `SELECT * FROM dataSiswa`
    let params = []

    if(cursor){
        query += ` WHERE idSiswa > ?`
        params.push(cursor)
    }

    query += ` ORDER BY idSiswa ASC LIMIT ?`
    params.push(pageSize)

    conn.query(query, params, (err, result) => {
        if(err) throw err

        console.log(result.length)

        const nextCursor = result.length > 0 ? result[result.length - 1].id : null;
        const previousCursor = result.length > 0 ? result[0].idSiswa : null

        response(200, result, "Berhasil Mendapat Data", previousCursor, nextCursor, res)
    })
}
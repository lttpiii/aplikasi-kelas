const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const multer = require(`multer`)
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const dataController = require(`./controllers/dataController`)
const userController = require(`./controllers/userConrtoller`)
const eventController = require(`./controllers/eventController`)

app.use(bodyParser.json())

// Method For Data Siswa
app.post(`/api/data/insertBulk`, dataController.insertDataBulk)
app.post(`/api/data/create`, dataController.insertData)
app.get(`/api/data/page`, dataController.getDataByPage)
app.put(`/api/data/update/:absen`, dataController.editData)
app.delete(`/api/data/delete/:absen`, dataController.deleteData)

// Method For Users
app.post(`/api/user/create`, userController.insertUser)
app.get(`/api/user/login`, userController.getUser)
app.get(`/api/user/admin`, userController.getAdmin)

// Method For Events
app.post(`/api/event/create`, upload.single(`image`), eventController.insertEvent)

const port = 3030
app.listen(port, () => {
    console.log(`Server Running ON http://localhost${port}`)
})
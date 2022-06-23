require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express")

const mainRouter = require("./routers/mainRouter")

const errMiddleware = require("./middlewares/errMiddleware")

const PORT = process.env.PORT

const app = express();

app.use(bodyParser.urlencoded({
	extended: true
}))

app.use(express.json())
app.use(express.static(`${__dirname}/${process.env.LOCAL}`))

const cors = require("cors")
app.use(cors())

app.use("/api/v1", mainRouter)

app.use(errMiddleware)

const start = async () => {
	try {
		app.listen(PORT, () => {
			console.log("Server started!")
		})
	} catch (e) {
		console.log(e)
	}
}

start();


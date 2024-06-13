import express from 'express'
import routes from './routes'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})
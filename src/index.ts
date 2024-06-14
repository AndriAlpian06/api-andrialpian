import express from 'express'
import routes from './routes'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Middleware untuk melayani file statis dari direktori 'uploads'
app.use('/api-andrialpian/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || '../uploads')));
console.log('Serving static files from:', path.join(__dirname, '../uploads'));


app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})
import express from 'express'
import routes from './routes'

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use('/', routes)
app.use('/about', routes)

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})
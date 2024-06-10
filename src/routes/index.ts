import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.json({ message : 'Hello world!'});
})

router.get('/about', (req, res) => {
    res.json({ message : 'ini data about'})
})
export default router;
import express, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv'
import upload from '../middleware/upload'
import path from 'path'

// Konfigurasi
dotenv.config

const prisma = new PrismaClient()
const router = Router();

//router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

router.get('/', (req, res) => {
    res.json({ message : 'Hello world!!!'});
})

// Add User
router.post('/addUser', upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'cv', maxCount: 1 }]), async (req:Request, res:Response) => {    
    console.log('Received fields:', req.body);
    console.log('Received file:', req.files);

    try{
        const { name, email, bio, sub_bio1, sub_bio2} = req.body;
        let profilePicture: string | undefined; 
        let profileCv: string | undefined;

        if (req.files && 'picture' in req.files && req.files['picture']) {
            profilePicture = (req.files['picture'][0] as Express.Multer.File).path;
        }

        if (req.files && 'cv' in req.files && req.files['cv']) {
            profileCv = (req.files['cv'][0] as Express.Multer.File).path;
        }

        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                bio,
                sub_bio1,
                sub_bio2,
                profile_picture: profilePicture,
                cv: profileCv,
            },
        })

        res.status(200).json(newUser)
    }
    catch (e){
        console.error(e)
        res.status(500).json({ error: 'Internal server error'})
    }
})

// Update User
router.put('/updateUser/:id', upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'cv', maxCount: 1 }]), async (req:Request, res:Response) => {    
    console.log('Received fields:', req.body);
    console.log('Received file:', req.files);

    try{
        const { id } = req.params;
        const { name, email, bio, sub_bio1, sub_bio2} = req.body;
        let profilePicture: string | undefined; 
        let profileCv: string | undefined;

        if (req.files && 'picture' in req.files && req.files['picture']) {
            profilePicture = (req.files['picture'][0] as Express.Multer.File).path;
        }

        if (req.files && 'cv' in req.files && req.files['cv']) {
            profileCv = (req.files['cv'][0] as Express.Multer.File).path;
        }

        const updateUser = await prisma.users.update({
            where: { user_id: Number(id) },
            data: {
                name,
                email,
                bio,
                sub_bio1,
                sub_bio2,
                profile_picture: profilePicture,
                cv: profileCv,
            },
        })

        res.status(200).json(updateUser)
    }
    catch (e){
        console.error(e)
        res.status(500).json({ error: 'Internal server error'})
    }
})

router.get('/user', async (req: Request, res: Response) => {
    const users = await prisma.users.findMany();
    res.json(users);
});

router.get('/about', (req, res) => {
    res.json({ message : 'ini data about'})
})

router.get('/test', (req, res) => {
    res.json({ message: 'ini hanya test test'})
})

export default router;
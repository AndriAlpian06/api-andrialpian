import express, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';
import upload from '../middleware/upload';
import authenticateToken from '../middleware/auth'
import path from 'path';

// Konfigurasi
dotenv.config()

const prisma = new PrismaClient()
const router = Router();

const projectFolder = 'api-andrialpian';

router.get('/', (req, res) => {
    res.json({ message : 'Hello world!!!'});
})

// Function duration
function parseDuration(duration: string): number {
    const match = duration.match(/(\d+)([smhd])/);
    if(!match){
        throw new Error('Invalid duration format')
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch(unit){
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 60 * 60;
        case 'd': return value * 24 * 60 * 60;
        default: throw new Error('Invalid duration unit');
    }
}

// Endpoint untuk generate token
router.post('/getAccessToken', async(req: Request, res: Response) => {
    const { userId, email } = req.body;

    try{

        const user = await prisma.users.findUnique({ where: { user_id: Number(userId)}})

        if(!user || user.email !== email){
            return res.status(400).json({ error: 'User ID or email is incorrect' });
        }
        
        const token = jwt.sign({ userId}, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn})
        const expiresIn = typeof jwtConfig.expiresIn === 'string' ? parseDuration(jwtConfig.expiresIn): jwtConfig.expiresIn
        res.json({ token: token, expires_in: expiresIn })

    } catch (e){
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/user', authenticateToken, async (req: Request, res: Response) => {
    const users = await prisma.users.findMany();
    res.json(users);
});

// Add User
router.post('/addUser', upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'cv', maxCount: 1 }]), async (req:Request, res:Response) => {    
    console.log('Received fields:', req.body);
    console.log('Received file:', req.files);

    try{
        const { name, email, bio, sub_bio1, sub_bio2} = req.body;
        let profilePicture: string | undefined; 
        let profileCv: string | undefined;

        if (req.files && 'picture' in req.files && req.files['picture']) {
            profilePicture = `${req.protocol}://${req.get('host')}/${projectFolder}/uploads/${(req.files['picture'][0] as Express.Multer.File).filename}`;
        }

        if (req.files && 'cv' in req.files && req.files['cv']) {
            profileCv = `${req.protocol}://${req.get('host')}/${projectFolder}/${(req.files['cv'][0] as Express.Multer.File).filename}`;
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
router.put('/updateUser/:id', authenticateToken, upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'cv', maxCount: 1 }]), async (req:Request, res:Response) => {    
    console.log('Received fields:', req.body);
    console.log('Received file:', req.files);

    try{
        const { id } = req.params;
        const { name, email, bio, sub_bio1, sub_bio2} = req.body;
        let profilePicture: string | undefined; 
        let profileCv: string | undefined;

        if (req.files && 'picture' in req.files && req.files['picture']) {
            profilePicture = `${req.protocol}://${req.get('host')}/${projectFolder}/uploads/${(req.files['picture'][0] as Express.Multer.File).filename}`;
        }

        if (req.files && 'cv' in req.files && req.files['cv']) {
            profileCv = `${req.protocol}://${req.get('host')}/${projectFolder}/uploads/${(req.files['cv'][0] as Express.Multer.File).filename}`;
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

// Skills
router.get('/skills', authenticateToken, async (req, res) => {
    const skills = await prisma.skills.findMany();

    res.status(200).json(skills);
})

// Add Skills
router.post('/addSkills', authenticateToken, upload.fields([{ name: 'picture_skill', maxCount: 1 }]), async(req, res) => {
    try{
        const { user_id, skill_name } = req.body;
        let pictureSkill: string = ""; 

        if (req.files && 'picture_skill' in req.files && req.files['picture_skill']) {
            pictureSkill = `${req.protocol}://${req.get('host')}/${projectFolder}/uploads/${(req.files['picture_skill'][0] as Express.Multer.File).filename}`;
        }

        const addSkills = await prisma.skills.create({
            data: {
                user_id: parseInt(user_id),
                skill_name,
                picture_skill: pictureSkill
            }
        })

        res.status(200).json(addSkills);

    } catch (e){
        console.log('Gagal add skills')
    }
})

// Update Skills
router.put('/updateSkill/:id', authenticateToken, upload.fields([{ name: 'picture_skill', maxCount: 1 }]), async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, skill_name } = req.body;
        let pictureSkill: string = "";
        
        if (req.files && 'picture_skill' in req.files && req.files['picture_skill']) {
            pictureSkill = `${req.protocol}://${req.get('host')}/${projectFolder}/uploads/${(req.files['picture_skill'][0] as Express.Multer.File).filename}`;
        }

        const updateSkill = await prisma.skills.update({
            where: { skill_id: Number(id) },
            data: {
                user_id: parseInt(user_id),
                skill_name,
                picture_skill: pictureSkill
            }
        })

        res.status(200).json(updateSkill);
        

    } catch (e){
        console.log(e)
        console.log('Gagal update skill')
    }
})

// Delete skill
router.delete('/deleteSkill/:id', async(req, res) => {
    try{
        const { id } = req.params;

        const deleteSkill = await prisma.skills.delete({
            where: { skill_id: Number(id)}
        })

        res.status(200).json({
            data: "Data skill dengan id ${id} telah dihapus"
        })
        
    } catch (e){
        res.status(400).json(e)
    }
})

// Show Portfolio
router.get('/projects', async(req, res) => {
    const projects = await prisma.projects.findMany();

    res.status(200).json(projects)
})

// Add Portfolio
router.post('/addProject', upload.fields([{ name: 'picture_project', maxCount: 1 }]), async (req, res) => {
    try{
        const { user_id, title, desc, project_url } = req.body;
        let pictureProject: string = "";

        if(req.files && 'picture_project' in req.files && req.files['picture_project']){
            pictureProject = `${req.protocol}://${req.get('host')}/${projectFolder}/uploads/${(req.files['picture_project'][0] as Express.Multer.File).filename}`;
        }
        
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);
        
        const addProject = await prisma.projects.create({
            data: {
                user_id: parseInt(user_id),
                title,
                description: desc,
                project_url,
                picture_project: pictureProject,
                start_date: startDate,
                end_date: endDate
            }
        })

        res.status(200).json(addProject);
    } catch (e){
        // console.log("Gagal add portfolio", e)
        res.status(400).json(e)
    } 
})

// Update Project
router.put('/updateProject/:id', upload.fields([{ name: 'picture_project', maxCount: 1 }]), async(req, res) => {
    try{
        const { id } = req.params;
        const { user_id, title, desc, project_url } = req.body;
        let pictureProject: string = "";

        if(req.files && 'picture_project' in req.files && req.files['picture_project']){
            pictureProject = `${req.protocol}://${req.get('host')}/${projectFolder}/uploads/${(req.files['picture_project'][0] as Express.Multer.File).filename}`;
        }

        const endDate = new Date();

        const updateProject = await prisma.projects.update({
            where: { project_id: Number(id)},
            data: {
                user_id: parseInt(user_id),
                title,
                description: desc,
                project_url,
                end_date: endDate
            }
        })

        res.status(200).json(updateProject);
    } catch (e){
        res.status(400).json(e)
    }
})

// Delete Project
router.delete('/deleteProject/:id', async(req, res) => {
    try{
        const { id } = req.params;

        const deleteProject = await prisma.projects.delete({
            where: { project_id: Number(id)}
        })

        res.status(200).json({
            data: `Project dengan id ${id} berhasil di hapus`
        })

    } catch (e){
        res.status(400).json(e)
    }
})

router.get('/about', (req, res) => {
    res.json({ message : 'ini data about'})
})

router.get('/test', (req, res) => {
    res.json({ message: 'ini hanya test test'})
})

export default router;
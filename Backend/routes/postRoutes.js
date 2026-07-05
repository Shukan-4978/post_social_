const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Post = require('../models/Post.js');
const auth = require('../middleware/Auth.js');

const postRouter = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'PostSocial',
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
  },
});

const upload = multer({
    storage: storage,
    limits:{fileSize: 5*1024*1024}
});

//post create a post with text, image or both
postRouter.post('/', auth, upload.single('image'), async(req,res)=>{
    try{
        const { text } = req.body;

        if(!text && !req.file){
            return res.status(400).json({ message:"Post must have text or an image"});
        }

        const post = await Post.create({
            user: req.user.id,
            username: req.user.username,
            text: text || '',
            image: req.file ? req.file.path : ''
        });

        res.status(201).json(post);
    }catch(error){
        res.status(500).json({ message: 'Server error', error:error.message });
    }
});

// get all post for the feed, new 1st in feed
postRouter.get('/', auth, async(req,res)=>{
    try{
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts)
    }catch (error){
        res.status(500).json({ message: 'server error', error: error.message });
    }
});

// put like or unlike a post
postRouter.put('/:id/like', auth, async(req,res)=>{
    try{
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({ message:"Post not found" });
    }

    const userId = req.user.id;
    const alreadyLiked = post.likes.some((id)=>id.toString() === userId);

    if(alreadyLiked){
        post.likes = post.likes.filter((id)=>id.toString() !== userId);
    }else{
        post.likes.push(userId);
    }

    await post.save();
    res.json(post);
}catch(error){
    res.status(500).json({ message:"Server error", error:error.message });
}
});

// add comment to post
postRouter.post('/:id/comment', auth, async (req,res)=>{
    try{
        const { text } = req.body;
        if(!text || !text.trim()){
            return res.status(400).json({ messaage:"comment text is required" });
        }

        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message:"Post not found" });
        }

        post.comments.push({
            user: req.user.id,
            username: req.user.username,
            text
        });

         console.log("Comments After:", post.comments);

        await post.save();
        res.json(post)
    }catch(error){
        res.status(500).json({ message:"Server error", error:error.message});
    }
});

module.exports = postRouter
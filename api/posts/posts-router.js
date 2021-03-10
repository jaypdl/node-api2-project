const express = require('express');

// implement your posts router here

const router = express.Router(); //bringing in the router
const Posts = require('./posts-model'); //Bringing in the model

// ENDPOINTS /api/posts
//! All endpoints begin with /api/posts

//# [GET] / (Returns all posts)
router.get('/', async (req, res) => {
  try {
    const allPosts = await Posts.find();
    // throw new Error('oh snap')
    res.json(allPosts);
  } catch (err) {
    res.status(500).json({ message: "The posts information could not be retrieved", errorMessage: err.message });
  }
})

//# [GET] /:id (Returns specified post)
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const foundPost = await Posts.findById(id);
    console.log(foundPost)
    if (!foundPost) {
      res.status(404).json({ message: "The post with the specified ID does not exist" });
    } else {
      res.json(foundPost);
    }
  } catch (err) {
    res.status(500).json({ message: "The post information could not be retrieved" });
  }
})

//# [GET] /:id/comments (Returns comments of specified post)
router.get('/:id/comments', async (req, res) =>{
  const { id } = req.params;
  try {
    const post = await Posts.findById(id)
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist" })
    } else {
      const comments = await Posts.findPostComments(id)
      // console.log(comments)
      res.json(comments)
    }
  } catch (err) {
    res.status(500).json({ message: "The comments information could not be retrieved" })
  }
})

//# [POST] / (Creates new post)
router.post('/', async (req, res) => {
  const newPost = req.body;
  if (!newPost.title || !newPost.contents) {
    res.status(400).json({ message: "Please provide title and contents for the post" })
  } else {
    try {
      const postCreated = await Posts.insert(newPost)
      res.status(201).json({...postCreated, ...newPost})
    } catch (err) {
      res.status(500).json({ message: "There was an error while saving the post to the database" })
    }
  }
})

//# [PUT] /:id (Updates the specified post)
router.put('/:id', async (req, res) =>{
  const { id } = req.params;
  const updatedPost = req.body;
  try {
    const post = await Posts.findById(id)
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist" });
    } else if (!updatedPost.title || !updatedPost.contents) {
      res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
      // throw new Error('oops')
      const update = await Posts.update(id, updatedPost);
      res.json({id, ...updatedPost, update});
    }
  } catch(err) {
    res.status(500).json({ message: "The post information could not be modified" })
  }
})

//# [DELETE] /:id (Deleted specified post)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Posts.findById(id)
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist" })
    } else {
      const deleted = await Posts.remove(id)
      // throw new Error('fails')
      res.json(deleted)
    }
  } catch (err) {
    res.status(500).json({ message: "The post could not be removed" })
  }
})

// EXPORT
module.exports = router;
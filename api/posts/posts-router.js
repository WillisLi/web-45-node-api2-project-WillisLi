const express = require('express');
const Post = require('./posts-model');
const router = express.Router();

router.get('/', (request, response) => {
    Post.find()
    .then(posts => {
        response.status(200).json(posts);
    })
    .catch(error => {
        console.log(error);
        response.status(500).json({ message: "The posts information could not be retrieved" })
    })
}) 

router.get('/:id', (request, response) => {
    const postId = request.params.id;
    Post.findById(postId)
        .then(post => {
            if (post) {
                response.status(200).json(post)
            } else {
                response.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ message: "The post information could not be retrieved" });
        })
})

router.post('/', (request, response) => {
    const post = request.body;
    if (!post.title || !post.contents) {
        response.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        Post.insert(post)
        .then(insertedPost => {
            response.status(201).json(insertedPost);
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ message: "There was an error while saving the post to the database" });
        })
    }
})

router.put('/:id', (request, response) => {
    const postId = request.params.id;
    const post = request.body;

    if (!post.title || !post.contents) {
        response.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        Post.update(postId, post)
        .then(updatedPost => {
            if (updatedPost) {
                response.status(200).json(updatedPost);
            } else {
                response.status(404).json({ message: "The post with the specified ID does not exist" });
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ message: "The post information could not be modified" });
        })
    }
})

router.delete('/:id', (request, response) => {
    const postId = request.params.id;
    Post.remove(postId)
        .then(removedPost => { 
            if (removedPost) {
                response.status(200).json(removedPost);
            } else {
                response.status(404).json({ message: "The post with the specified ID does not exist" });
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ message: "The post could not be removed" });
        })
}) 

router.get('/:id/comments', (request, response) => {
    const postId = request.params.id;
    Post.findPostComments(postId)
        .then(post => {
            if (post) {
                response.status(200).json(post);
            } else {
                response.status(404).json({ message: "The post with the specified ID does not exist" });
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ message: "The comments information could not be retrieved" });
        })
})

module.exports = router;
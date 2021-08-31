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
                Post.findById(insertedPost.id)
                    .then(newPost => {
                        response.status(201).json(newPost);
                    })
                    .catch(error => {
                        response.status(500).json({ message: "The post information could not be retrieved" })
                    })
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
        Post.findById(postId)
            .then(currentPost => {
                if (currentPost) {
                    Post.update(currentPost.id, post)
                        .then(updatedPost => {
                            Post.findById(updatedPost)
                                .then(result => {
                                    response.status(200).json(result);
                                })
                        })
                        .catch(error => {
                            console.log(error);
                            response.status(500).json({ message: "The post information could not be modified" });
                        })
                } else {
                    response.status(404).json({ message: "The post with the specified ID does not exist" });
                } 
            })
            .catch(error => {
                console.log(error);
                response.status(500).json({ message: "The post information could not be retrieved" });
            })
    }
})

router.delete('/:id', (request, response) => {
    const postId = request.params.id;
    Post.findById(postId)
        .then(selectedPost => { 
            if (selectedPost) {
                Post.remove(selectedPost.id)
                    .then(removedPost => {
                        response.status(200).json(selectedPost);
                    })
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
    Post.findById(postId)
        .then(post => {
            if (post) {
                Post.findPostComments(post.id)
                    .then(currentPost => {
                        response.status(200).json(currentPost);
                    })
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
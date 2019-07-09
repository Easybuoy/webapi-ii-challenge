const express = require("express");

const router = express.Router();
const db = require("./data/db");

/**
 * METHOD: POST
 * ROUTE: /api/posts/
 * PURPOSE: Create new post
 */
router.post("/", async (req, res) => {
  try {
    const { title, contents } = req.body;

    if (!title || !contents) {
      return res.status(400).json({
        status: "error",
        message: "Please provide title and contents for the post."
      });
    }

    const postData = {
      title,
      contents
    };
    const newPost = await db.insert(postData);

    postData.id = newPost.id;
    if (newPost) {
      return res.status(201).json({
        status: "success",
        message: "Successfully created post",
        data: postData
      });
    }
    return res
      .status(500)
      .json({ status: "error", message: "Error creating post" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error creating post" });
  }
});

/**
 * METHOD: POST
 * ROUTE: /api/posts/:id/comments
 * PURPOSE: Create comment for a post
 */
router.post("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ status: "error", message: "Text field required" });
    }

    const post = await db.findById(id);
    if (post.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    const comment = {
      post_id: id,
      text
    };

    const newComment = await db.insertComment(comment);
    comment.id = newComment.id;
    if (newComment) {
      return res.status(201).json({
        status: "success",
        message: "Comment added successfully",
        data: comment
      });
    }
    return res
      .status(500)
      .json({ status: "error", message: "Error creating comment" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error creating comment" });
  }
});

/**
 * METHOD: GET
 * ROUTE: /api/posts/
 * PURPOSE: Get all posts
 */
router.get("/", async (req, res) => {
  try {
    const posts = await db.find();

    if (posts.length > 0) {
      return res.json({ status: "success", data: posts });
    }
    return res
      .status(404)
      .json({ status: "error", message: "Posts not found" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error getting posts" });
  }
});

/**
 * METHOD: GET
 * ROUTE: /api/posts/:id
 * PURPOSE: Get a single post
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.findById(id);

    if (post.length > 0) {
      return res.json({ status: "success", data: post });
    }
    return res.status(404).json({ status: "error", message: "Post not found" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error getting post" });
  }
});

/**
 * METHOD: GET
 * ROUTE: /api/posts/:id/comments
 * PURPOSE: Get all posts for a comment
 */
router.get("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;

    const post = await db.findById(id);
    if (post === null) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    const comments = await db.findPostComments(id);
    if (comments.length > 0) {
      return res.json({ status: "success", data: comments });
    }
    return res
      .status(404)
      .json({ status: "error", message: "Comments not found" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error getting comments" });
  }
});

/**
 * METHOD: DELETE
 * ROUTE: /api/posts/:id/
 * PURPOSE: Delete a post
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.findById(id);

    if (post.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    const deletedPost = await db.remove(id);

    if (deletedPost === 1) {
      return res.json({
        status: "success",
        message: "Post deleted successfully"
      });
    }

    return res
      .status(500)
      .json({ status: "error", message: "Error deleting post" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error deleting post" });
  }
});

/**
 * METHOD: PUT
 * ROUTE: /api/posts/:id/
 * PURPOSE: Update a post
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, contents } = req.body;

    if (!title || !contents) {
      return res.status(400).json({
        status: "error",
        message: "Please provide title and contents for the post."
      });
    }

    const post = await db.findById(id);
    if (post.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    const updatedPost = await db.update(id, { title, contents });
    if (updatedPost === 1) {
      return res.json({
        status: "success",
        message: "Post updated successfully"
      });
    }

    return res
      .status(500)
      .json({ status: "error", message: "Error updating post" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error updating post" });
  }
});

module.exports = router;

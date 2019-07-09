const express = require("express");

const router = express.Router();
const db = require("./data/db");

router.post("/", async (req, res) => {
  try {
    const { title, contents } = req.body;
    console.log(title, contents);
    if (!title || !contents) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Please provide title and contents for the post."
        })

    }

    const postData = {
      title,
      contents
    };
    const newPost = await db.insert(postData);

    postData.id = newPost.id;
    if (newPost) {
      return res
        .status(201)
        .json({
          status: "success",
          message: "Successfully created post",
          data: postData
        })
        .end();
    }
    return res
      .status(500)
      .json({ status: "error", message: "Error creating post" })
      .end();
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error creating post" })
      .end();
  }
});

module.exports = router;

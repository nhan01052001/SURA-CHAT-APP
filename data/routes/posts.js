const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const post1 = new Post({
    title: req.body.title,
    description: req.body.description,
  });

  try {
    const savePost = await post1.save();
    res.json(savePost);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/specific", (req, res) => {
  res.send("Specific POST");
});

module.exports = router;

import fs from "fs-extra";
import path from "path";
import md5 from "md5";

import sidebar from "../helpers/sidebar.js";
import { randomNumber } from "../helpers/libs.js";
import { Image, Comment } from "../models/index.js";

export const index = async (req, res, next) => {
  let viewModel = { image: {}, comments: [] };
  
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });

  // Si la imagen no existe
  if (!image) return next(new Error("Imagen no encontrada"));

  // incrementa las vistas
  const updatedImage = await Image.findOneAndUpdate(
    { _id: image.id },
    { $inc: { views: 1 } }
  ).lean();

  viewModel.image = updatedImage;

  // obtiene los comentarios
  const comments = await Comment.find({ image_id: image._id }).sort({
    timestamp: 1,
  });

  viewModel.comments = comments;
  viewModel = await sidebar(viewModel);

  console.log(viewModel);
  res.render("image", viewModel);
};

  //Crea una nueva imagen
export const create = (req, res) => {
  const saveImage = async () => {
    const imgUrl = randomNumber();
    const images = await Image.find({ filename: imgUrl });
    if (images.length > 0) {
      saveImage();
    } else {
      // Ubicacion de la imagen
      const imageTempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`./uploads/${imgUrl}${ext}`);

      // Extensiones validas
      if (
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".gif"
      ) {

        await fs.rename(imageTempPath, targetPath);

        // creacion de la nueva imagen
        const newImg = new Image({
          title: req.body.title,
          filename: imgUrl + ext,
          description: req.body.description,
        });

        // Guarda la imagen 
        const imageSaved = await newImg.save();

        // redirecciona la imagen a la lista
        res.redirect("/images/" + imageSaved.uniqueId);
      } else {
        await fs.unlink(imageTempPath);
        res.status(500).json({ error: "Only Images are allowed" });
      }
    }
  };
  //guarda la imagen
  saveImage();
};
  //Contador de like's
export const like = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  console.log(image);
  if (image) {
    image.likes = image.likes + 1;
    await image.save();
    res.json({ likes: image.likes });
  } else {
    res.status(500).json({ error: "Internal Error" });
  }
};

export const comment = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  
  if (image) {
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();
    res.redirect("/images/" + image.uniqueId + "#" + newComment._id);
  } else {
    res.redirect("/");
  }
};

export const remove = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    await fs.unlink(path.resolve("./uploads/" + image.filename));
    await Comment.deleteOne({ image_id: image._id });
    await image.remove();
    
    res.json(true);
  } else {
    res.json({ response: "Bad Request." });
  }
};

export const getComments = async (req, res) => {
  
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    const comments = await Comment.find({ image_id: image._id }).sort({
      timestamp: 1,
    });
    res.json(comments);
  } else {
    res.json({ response: "Bad Request." });
  }

}
export const getImage = async (req, res) => {
  const image = await Image.findOne({
    _id: req.params.image_id,
  });
  if (image) {
    res.json(image);
  } else {
    res.json({ response: "Bad Request." });
  }
};
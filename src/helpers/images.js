import { Image } from "../models/index.js";

export default {
  async popular() {
    const images = await Image.find()
      .limit(9)
      .sort({ likes: -1 })
      .lean({ virtuals: true });
    return images;
  },
};

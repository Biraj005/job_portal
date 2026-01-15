import dataUri from "datauri/parser.js";
import path from "path";

const getBufferDataUri = (file: Express.Multer.File) => {
  const parser = new dataUri();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};
export default getBufferDataUri;

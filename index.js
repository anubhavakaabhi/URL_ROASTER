import express from 'express';
import * as cheerio from 'cheerio';
import {GoogleGenAI} from '@google/genai';
import ejs from 'ejs';
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home')
});
app.get("/roast", async (req, res) => {
    try {
  const response = await axios.get(req.query.url);
  const html = response.data;
  const $ = cheerio.load(html);
 const stats = {
  images: ($('svg').length)+($('img').length)||0,
  scripts: $('script').length||0,
  hasTitle: $('title').length > 0,
  hasMetaDescription: $('meta[name="description"]').length > 0,
  h1Count: $('h1').length||0,
}
async function main() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `i want you to roast the website having ${stats.images} images and svg , ${stats.scripts} script tag , hasTitle = ${stats.hasTitle} , Has description = ${stats.hasMetaDescription} , Have ${stats.h1Count} h1 tag and website url is ${req.query.url}, the personality of roast is roaster . Give the output in indian style ,sHort in 1 line and interestingly fun way  and in text only roast nothing else.`,
  });
  res.render('roast', { roast: response.text , url: req.query.url , img : stats.images , script : stats.scripts , h1: stats.h1Count  } );
}
main();
} catch (error) {
  console.error(error);
}
});
app.listen(PORT, () => {
    console.log(`Server is running`);
});
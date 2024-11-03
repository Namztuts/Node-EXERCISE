const fs = require('fs');
const process = require('process');
const axios = require('axios');

function cat(path) {
   fs.readFile(path, 'utf8', (error, data) => {
      if (error) {
         console.log(`Error reading${path}`, error);
         process.kill(1);
      }
      console.log('cat: ', data);
   });
}

async function webCat(url) {
   try {
      let response = await axios.get(url);
      console.log('webCat: ', response.data);
   } catch (error) {
      console.log(`Error fetching ${url}`, error);
      process.kill(1);
   }
}

const path = 'https://www.google.com/';
if (path.slice(0, 4) === 'http') {
   webCat(path);
} else {
   cat(path);
}

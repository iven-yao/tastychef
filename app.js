let express = require('express');
let axios = require('axios');
let path = require('path');
let url = require('url');
let app = express();
require('dotenv').config()

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/',express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

// TheMealDB
let getRecipesListByQuery = async (q) => {
  let payload = {s:q.split(' ').join('_')};
  const param = new url.URLSearchParams(payload);
  try{
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/search.php?"+ param
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

let getRandomRecipe = async () => {
  try{
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

let getRecipeDetail = async (id) => {
  let payload = {i:id};
  const param = new url.URLSearchParams(payload);
  try{
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/lookup.php?"+ param
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

let getCategoryList = async () => {
  try{
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

let getCountryList = async () => {
  try{
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}


// Tasty API
// let apiKey = {
//   'X-RapidAPI-Key': process.env.API_KEY,
//   'X-RapidAPI-Host': process.env.API_HOST
// };
// let getRecipesListByQuery = async (q) => {
//   const qStr = q.split(' ').join('_');
//   const options = {
//     method: 'GET',
//     url: 'https://tasty.p.rapidapi.com/recipes/list',
//     params: {
//       from:0,
//       size:20,
//       q:qStr
//     },
//     headers: apiKey
//   };
//   try {
//     const response = await axios.request(options);
//     return response.data;
//   } catch (err) {
//     console.log(err);
//   }
// }

// let getRecipeDetail = async (id) => {
//   const options = {
//     method: 'GET',
//     url: 'https://tasty.p.rapidapi.com/recipes/get-more-info',
//     params: {
//       id:id
//     },
//     headers: apiKey
//   };
//   try {
// 	  const response = await axios.request(options);
// 	  return response.data;
//   } catch (error) {
//     console.error(error);
//   } 
// }

app.get(['/','/search'], (req, res) => {
  res.render('pages/index');
});

app.get('/favorite', (req, res) => {
  res.render('pages/favorite');
});

app.get('/country', (req, res) => {
  res.render('pages/country');
});

app.get('/about', (req, res) => {
  res.render('pages/about');
})

// get recipes
app.get('/api/search', async (req, res) => {
  let data = await getRecipesListByQuery(req.query.q);
  res.render('partials/result', {"results": data.meals, "random": false});
});

// get random
app.get('/api/random', async (req, res) => {
  let data = await getRandomRecipe();
  res.render('partials/result', {"results": data.meals, "random": true});
})

// get detail
app.get('/api/detail', async(req, res) => {
  let data = await getRecipeDetail(req.query.id);
  res.render('partials/detail', {"detail":data.meals[0]});
});

module.exports = app;
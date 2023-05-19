let express = require('express');
let axios = require('axios');
let path = require('path');
let url = require('url');
let app = express();
require('dotenv').config()

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/',express.static(path.join(__dirname, "public")));
app.use(express.json());
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

let categoryList = null;
let getCategoryList = async () => {
  if(categoryList != null) return categoryList;
  try{
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
    );
    categoryList = res.data;
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

let countryList = null;
let getCountryList = async () => {
  if(countryList != null) return countryList;
  try{
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    countryList = res.data;
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

let getAreaRecipes = async (area) => {
  let payload = {a:area};
  const param = new url.URLSearchParams(payload);
  try{
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/filter.php?"+param
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

let getCategoryRecipes = async (cat) => {
  let payload = {c:cat};
  const param = new url.URLSearchParams(payload);
  try{
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/filter.php?"+param
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

let init = () => {
  getCountryList();
  getCategoryList();
}

init();

app.get(['/','/search'], (req, res) => {
  res.render('pages/index');
});

app.get('/favorite', (req, res) => {
  res.render('pages/favorite');
});

app.get('/country', async (req, res) => {
  res.render('pages/country', {"countries": countryList.meals});
});

app.get('/category', async (req, res) => {
  res.render('pages/category', {"categories": categoryList.meals});
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

// get area recipes
app.get('/api/area', async(req, res) => {
  let data = await getAreaRecipes(req.query.a);
  res.render('partials/result', {"results": data.meals, "random": false});
});

// get category recipes
app.get('/api/cat', async(req, res) => {
  let data = await getCategoryRecipes(req.query.c);
  res.render('partials/result', {"results": data.meals, "random": false});
});

app.get('/favData', (req, res) => {
  let data = JSON.parse(req.query.data);
  res.render('partials/result', {"results": data.meals, "random": false});
})

module.exports = app;
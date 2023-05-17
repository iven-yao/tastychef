let express = require('express');
let axios = require('axios');
let path = require('path');
let url = require('url');
let app = express();
require('dotenv').config()

let apiKey = {
  'X-RapidAPI-Key': process.env.API_KEY,
  'X-RapidAPI-Host': process.env.API_HOST
};

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/',express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

let getRecipesList = async (q) => {
  let payload = {s:q};
  const param = new url.URLSearchParams(payload);
  try{
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/search.php?"+ param
    )
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

let getRecipeDetail = async (id) => {
  const options = {
    method: 'GET',
    url: 'https://tasty.p.rapidapi.com/recipes/list',
    params: {
      id:id
    },
    headers: apiKey
  };
  try {
	  const response = await axios.request(options);
	  return response.data;
  } catch (error) {
    console.error(error);
    return "error: " + error;
  } 
}

app.get('/', (req, res) => {
  res.render('pages/index');
});

// get recipes
app.get('/api/search', async (req, res) => {
  let data = await getRecipesList(req.query.q);
  res.render('partials/result',{"results": data.meals});
});

// get detail
app.get('/api/detail', async(req, res) => {
  let data = await getRecipesDetail(req.query.id);
  console.log(data);
});
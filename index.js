let express = require('express');
let path = require('path');
let app = express();


app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(4000, () => console.log('Example app listening on port 4000!'));
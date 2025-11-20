const express = require("express");
const { connectToMongoDB } = require("./connect");

const urlRoute = require('./routes/url');
const URL = require('./models/url');
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb+srv://pramanickt15_db_user:Tanmoy123@cluster0.ggvgec6.mongodb.net/?appName=Cluster0').then(() => console.log('Mongodb connected')).catch((err) => console.log("DB Connection Error:", err));

app.use(express.json())

// Enable CORS for development (allow requests from frontend dev server)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.sendStatus(200);
  }
  next();
});

app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate({
    shortId
  }, {
    $push: {
      visitHistory: {
        timestamp: Date.now(),
      },
    }
  })
  res.redirect(entry.redirectURL)
})

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`))
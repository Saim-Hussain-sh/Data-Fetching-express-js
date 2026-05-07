

const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json())
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173",
}))
const API_KEY = "016c04095f4e6190acc80c5bd3690ab6";
const NAMES = ["Saim", "Zain", "Tazeem", "Ehtisham", "Zainab"];
const authMiddleware = require("./auth");
async function fetchData(url) {
  if (!url || typeof url !== "string") {
    throw new Error("Invalid URL");
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
function formatResult(result){
    return {
        [result.name]:{
            count:result.count,
            gender:result.gender,
            probability:result.probability,
            deliverable:result.probability>0.95,
        },
    };
};

app.get("/",(req,res)=>{
    res.send("Your server is running smoothly!")
})

app.post("/submit-name",authMiddleware,async(req,res)=>{
    const { name } = req.body;

    if(!name || typeof name !=="string"){
        return res.status(400).json({success:false,error:"Please provide valid 'name' in request body"});
    }

    try{
        const url = `https://api.genderize.io/?name=${encodeURIComponent(name)}&apikey=${API_KEY}`;
        const result = await fetchData(url);

        const response  ={
            [result.name]:{
                count:result.count,
                gender:result.gender,
                probability:result.probability,
                deliverable:result.probability>0.95
            },
        };
        res.json({success:true,data:response})
    }
    catch(error){
        res.status(500).json({success:false,error:error.message})
    }
});

app.get("/gender/:name",authMiddleware,async(req,res)=>{
    const {name} = req.params;

    try{
        const url=`https://api.genderize.io/?name=${encodeURIComponent(name)}&apikey=${API_KEY}`;
        const result = await fetchData(url);
        res.json({success:true,data:formatResult(result)});
    }
    catch(error){
        res.status(500).json({success:false,error:error.message});
    }
});

app.get("/gender",authMiddleware,async(req,res)=>{
    const {name} = req.query;

    if(!name || typeof name !=="string"){
        return res.status(400).json({success:false,error:"Please provide valid 'name' as query parameter. e.g. /gender?name=Saim"});

    }
    try{
        const url = `https://api.genderize.io/?name=${encodeURIComponent(name)}&apikey=${API_KEY}`;
        const result = await fetchData(url);
        res.json({success:true,data:formatResult(result)});

    }
    catch(error){
        res.status(500).json({success:false,error:error.message})
    }

});

app.get("/gender-data", authMiddleware, async (req, res) => {
  try {
    const results = [];

    for (const name of NAMES) {
      const url = `https://api.genderize.io/?name=${encodeURIComponent(name)}&apikey=${API_KEY}`;
      try {
        const result = await fetchData(url);
        results.push(result);
      } catch (error) {
        console.error(`Failed for ${name}:`, error.message);
        results.push({ name, error: error.message });
      }
    }

    const transformed = results.reduce(
      (acc, { name, count, gender, probability }) => {
        acc[name] = {
          count,
          gender,
          probability,
          deliverable: probability > 0.95,
        };
        return acc;
      },
      {}
    );

    res.json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}\n`);
  console.log(`GET    http://localhost:${PORT}/`);
  console.log(`POST   http://localhost:${PORT}/submit-name        body: { "name": "Saim" }`);
  console.log(`GET    http://localhost:${PORT}/gender/Saim         route param`);
  console.log(`GET    http://localhost:${PORT}/gender?name=Saim    query param`);
  console.log(`GET    http://localhost:${PORT}/gender-data         all 5 names\n`);
});
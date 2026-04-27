async function fetchData(url) {
    try{
        if (!url || typeof url !== "string") {
            throw new Error("Invalid URL", { cause: "URL is not valid" });
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`, { cause: "Response from server is not ok" });
        }

        return response.json();
    }
    catch(error){
        console.error(error.message)
        return error

    }
}

async function main() {
    const arr = ["Saim", "Zain", "Tazeem", "Ehtisham", "Zainab"];
    const results = [];
    const API_KEY = "016c04095f4e6190acc80c5bd3690ab6";

    for (const name of arr) {
        const url = `https://api.genderize.io/?name=${encodeURIComponent(name)}&apikey=${API_KEY}`;
        
        try {
            const result = await fetchData(url).catch(error=>{throw new Error()});
            results.push(result);
        } catch (error) {
            console.error("Failed:", error.message);
            results.push({ name, error: error.message });
        }
    }

    return results;
}

const a = await main();
console.log(a);

const transformedarr=a.reduce((acc,{name,count,gender,probability,deliverable})=>{
acc[name]={count,gender,probability,deliverable:probability>0.95};
return acc 
},{});

console.log(transformedarr)

// Saim{count: 13837, gender: 'male', probability: 0.97 ,deloverable:true/false(if its >0.95)}

// const data=[]
// data.push(a)
// console.log(data)











// async function fetchData(url){
//         if(!url || typeof url!=="string"){
//             throw new Error("Invalid URL", { cause: "URL is not valid"});
//         }

//         let responses= await fetch(url);
//         if(!responses.ok){
//             throw new Error(`HTTP ${responses.status}` , {cause:"Response from server is not ok"});
//         }
//         let data = await responses.json();

//         return data;
//     }
// async function main(){
//     const arr = ["Saim","Zain","Tazeem","Ehtisham"];
//     const params = arr.map(name=>`name[]=${encodeURIComponent(name)}`).join("&");
//     const API_KEY = "016c04095f4e6190acc80c5bd3690ab6"
// const url = `https://api.genderize.io/?${params}&apikey=${API_KEY}`;           
//         try{
            
//             let result = await fetchData(url)
//             return result
           
//         }
//         catch(error){
//             console.error(error.message)
//             return[];
//         }
        
//     }
    

// let a = await main()
// console.log(a)




// [name:{

// },
// {},
// ]
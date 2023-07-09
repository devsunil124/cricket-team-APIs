const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path")
const app = express();
db = null;
dbPath = path.join(__dirname,"cricketTeam.db")
const intialzeDbAndServer = async() =>{
    try{
        db = await open({
            filename : dbPath ,
            driver : sqlite3.Database,
        });
        app.listen(3000,() => {
            console.log("Server Running at http://localhost:3000/")
        });
    }catch  (e){
        console.log(`DB error : ${e.message}`);
        process.exit(1);

    }
};
intialzeDbAndServer();


// API 1 --------------------------------------------------------//

app.get("/players/",async (request,response) => {
    const getPlayersQuery = `
    SELECT
    *
    FROM
    cricket_team 
    `;
    const playersArray =await db.all(getPlayersQuery);
    response.send(playersArray);
    console.log(playersArray)
})


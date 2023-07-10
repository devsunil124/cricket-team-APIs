const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path")
const app = express();
let db = null;
app.use(express.json());

const dbPath = path.join(__dirname,"cricketTeam.db")
const intialzeDbAndServer = async() =>{
    try{
        db = await open({
            filename : dbPath ,
            driver : sqlite3.Database,
        });
        app.listen(3000,() => {
            console.log("Server Running at http://localhost:3000/")
        });
    }catch(e){
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
        cricket_team ;
    `;
    const playersArray =await db.all(getPlayersQuery);
    response.send(playersArray);
    console.log(playersArray)
});

// API 2 --------------------------------------------------------//


app.post("/players/",async(request,response) => {
    const playerDetails = request.body;
    const {
        playerName,
        jersyNumber,
        role
    } = playerDetails
    const addPlayerQuery = `
    INSERT INTO
      cricket_team (playerName , jersyNumber, role)

    VALUES
      (
        ${playerName},
        ${jersyNumber},
        ${role}
      );
    `;
    const dbResponse = await db.run(addPlayerQuery);
    const playerId = dbResponse.lastID;
    response.send({playerId : playerId});
});


// API 3----------------------------------------------------------

app.get("/players/:playerId/", async (request,response) => {
    const { playerId } = request.params;
    const getPlayerQuery = `
    SELECT 
        * 
    FROM
     cricket_team
     WHERE 
       player_id = ${playerId};
    `;
    const player = await db.run(getPlayerQuery);
    response.send(player);
});

// API 4 ----------------------------------------------------------

app.put("/players/:playerId/", async(request,response) => {
    const{ playerId } = request.params;
    const playerDetails = request.body;
    const {
        playerName,
        jersyNumber,
        role
    } = playerDetails;
    const updatePlayerQuery = `
    UPDATE 
      cricket_team
     SET 
       player_name = ${playerName},
       jersy_number = ${jersyNumber},
       role = ${role}
     WHERE 
       player_id = ${playerId};   
    `;
    await db.run(updatePlayerQuery);
    response.send("Player Details Updated")
});


//API 5 ---------------------------------------------------------------

app.delete("/players/:playerId/",async (request,response) => {
    const {playerId} = request.params;
    const  deleteBookQuery = ` 
      DELETE FROM 
        WHERE 
         player_id = ${playerId};    
    `;
    await db.run(deleteBookQuery);
    response.send("Player Remove");
});

module.exports = app;

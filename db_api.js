//Requirements
const sqlite3 = require('sqlite3');
const dbClient = require("@notionhq/client");
const dbID = "adc986585ab64b5693b9399334c7d935";
const { auth, notionVersion } = require("./db_key");

const notion = new dbClient.Client({
  auth: auth,
  notionVersion: notionVersion,
});
let top3List = [];

var exports = (module.exports = {});

//Function
exports.getTop3 = async function (dir) {
  top3List = [];
  const res = await notion.databases.query({
    database_id: dbID,
    sorts: [
      {
        property: "power",
        direction: dir ? "descending" : "ascending",
      },
    ],
  });
  let cnt = 0;
  res.results.forEach((item) => {
    if (cnt === 3) {
      return;
    }
    top3List.push(item.properties);
    cnt += 1;
  });
  return top3List;
};

exports.addToDatabase = async function (username) {
  let check = false;
  const res = await notion.search({
    query: username,
  });
  if (res.results.length === 0) {
    check = true;
  }
  if (check) {
    try {
      await notion.pages.create({
        parent: {
          database_id: dbID,
        },
        properties: {
          name: {
            type: "title",
            title: [
              {
                type: "text",
                text: {
                  content: username,
                },
              },
            ],
          },
          win: {
            type: "number",
            number: 0,
          },
          lose: {
            type: "number",
            number: 0,
          },
          power: {
            type: "number",
            number: 0,
          },
          streak: {
            type: "number",
            number: 0,
          },
        },
      });
    } catch (error) {
      console.error(error.body);
    }
    return true;
  } else {
    return false;
  }
};

exports.searchUser = async function (userName) {
  const res = await notion.databases.query(
    {
      database_id: dbID,
      "filter":{
        "property": "name",
        "rich_text":{
          "equals":userName
        }
      }
    }
  );
  return res.results[0];
};

exports.updateValue = async function (originalData, state) {
  streak=originalData.properties.streak.number;
  bonus=1;
  switch (state) {
    case "win":
      if (2<=streak && streak<=3){
        bonus = 2;
      }else if (4==streak){
        bonus = 3;
      }else if (5<=streak){
        bonus = 4;
      }
      await notion.pages.update({
        page_id: originalData.id,
        properties: {
          win: {
            type: "number",
            number: (originalData.properties.win.number += 1),
          },
          power: {
            type: "number",
            number: (originalData.properties.power.number += 1),
          },
          streak:{
            type: "number",
            number: (streak > 0 ? streak + 1 : 1),
          },
        },
      });
      break;
    case "lose":
      if (-3<=streak && streak<=-2){
        bonus = 2;
      }else if (streak==-4){
        bonus = 3;
      }else if (streak<=-5){
        bonus = 4;
      }
      await notion.pages.update({
        page_id: originalData.id,
        properties: {
          lose: {
            type: "number",
            number: (originalData.properties.lose.number += 1),
          },
          power: {
            type: "number",
            number: (originalData.properties.power.number -= 1),
          },
          streak:{
            type: "number",
            number: (streak > 0 ? -1 : streak-1),
          },
        },
      });
      break;
  }
};


insertNewUser = function(id, name){
  const db=new sqlite3.Database('./hr_db.db',sqlite3.OPEN_READWRITE,function(err){
    if (err){
      console.log(err.message);
    }
  });
  const query = `INSERT INTO user(ID,NAME,WIN,LOSE,POWER,STREAK) VALUES(${id},"${name}",0,0,0,0)`;
  db.run(query, function(err){
    if (err){
      console.log(err.message);
    }
  });
  db.close()
}

getUser =async function(id,name){
  const db=new sqlite3.Database('./hr_db.db',sqlite3.OPEN_READWRITE,function(err){
    if (err){
      console.log(err.message);
    }
  });
  const find_query=`SELECT * from user WHERE ID=${id}`;
  const user_data = await new Promise(resolve => {
    db.get(find_query, (err,rows) =>{
      if (err){
        resolve({error: 'error message'});
      }else{
        resolve(rows);
      }
    })
  });
  db.close();
  if (user_data != undefined){
    return user_data;
  }else{
    insertNewUser(id,name);
    return {"ID": id, "NAME": name, "WIN":0,"LOSE":0,"POWER":1000,"STREAK": 0};
  }
};

exports.calculTeamValue =async function(teamIDs, teamNames){
  var teampower=0;
  for (i=0;i<teamIDs.length;i++){
    user_data=await getUser(teamIDs[i],teamNames[i]);
    teampower+=user_data["POWER"];
  }
  return teampower;
}

exports.getAllUserData = async function () {
  const db=new sqlite3.Database('./hr_db.db',sqlite3.OPEN_READWRITE,function(err){
    if (err){
      console.log(err.message);
    }
  });
  const find_query=`SELECT * from user`;
  const user_data = await new Promise(resolve => {
    db.all(find_query, (err,rows) =>{
      if (err){
        resolve({error: 'error message'});
      }else{
        resolve(rows);
      }
    })
  });
  db.close();
  return user_data;
};
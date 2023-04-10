//Requirements
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
exports.getAllUserData = async function () {
  const res = await notion.databases.query({
    database_id: dbID,
    sorts:[
      {
        property: "name",
        direction: "ascending",
      },
    ],
  });
  return res.results;
};

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

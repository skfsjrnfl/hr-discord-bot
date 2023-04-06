//Requirements
const dbClient = require("@notionhq/client");
const dbID = "adc986585ab64b5693b9399334c7d935";
const { auth, notionVersion } = require("./db_key");
const notion = new dbClient.Client({
  auth: auth,
  notionVersion: notionVersion,
});
let top3List = [];

var exports = module.exports = {};

//Function
exports.getAllUserData = async function() {
  const res = await notion.databases.query({
    database_id: dbID,
  });
  return res.results;
}

exports.getTop3 = async function(dir){
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
  }
  );
  return top3List;
}

exports.addToDatabase = async function(username){
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
        },
      });
    } catch (error) {
      console.error(error.body);
    }
    return true;
  } else {
    return false;
  }
}

exports.searchUser = async function(userName) {
  const res = await notion.search({
    query: userName,
  });
  return res;
}

exports.updateValue = async function(originalData, state) {
  switch (state) {
    case "win":
    await notion.pages.update({
        page_id: originalData.results[0].id,
        properties: {
        win: {
            type: "number",
            number: (originalData.results[0].properties.win.number += 1),
        },
        power: {
            type: "number",
            number: (originalData.results[0].properties.power.number += 1),
        },
        },
    });
    break;
    case "lose":
    await notion.pages.update({
        page_id: originalData.results[0].id,
        properties: {
        lose: {
            type: "number",
            number: (originalData.results[0].properties.lose.number += 1),
        },
        power: {
            type: "number",
            number: (originalData.results[0].properties.power.number -= 1),
        },
        },
    });
    break;
  }
}
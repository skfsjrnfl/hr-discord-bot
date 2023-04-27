const sqlite3 = require("sqlite3");
let top3List = [];

var exports = (module.exports = {});

exports.updateValue = async function (teamid, state) {
  const db = new sqlite3.Database(
    "./hr_db.db",
    sqlite3.OPEN_READWRITE,
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  let ori_data = [];
  for (let i = 0; i < teamid.length; i++) {
    const find_query = `SELECT * from user WHERE ID=${teamid[i]}`;
    const user_data = await new Promise((resolve) => {
      db.get(find_query, (err, rows) => {
        if (err) {
          resolve({ error: "error message" });
        } else {
          resolve(rows);
        }
      });
    });
    ori_data.push(user_data);
  }

  for (let i = 0; i < teamid.length; i++) {
    bonus = 1;
    next_win = ori_data[i]["WIN"];
    next_lose = ori_data[i]["LOSE"];
    next_power = ori_data[i]["POWER"];
    next_streak = ori_data[i]["STREAK"];
    if (state == "win") {
      next_win++;
      if (next_streak < 0) {
        next_streak = 1;
      } else {
        next_streak++;
      }
      if (2 <= next_streak && next_streak <= 3) {
        bonus = 2;
      } else if (next_streak == 4) {
        bonus = 3;
      } else if (next_streak >= 5) {
        bonus = 4;
      }
      next_power += bonus;
    } else {
      next_lose++;
      if (next_streak > 0) {
        next_streak = -1;
      } else {
        next_streak--;
      }
      if (-3 <= next_streak && next_streak <= -2) {
        bonus = 2;
      } else if (next_streak == -4) {
        bonus = 3;
      } else if (next_streak <= -5) {
        bonus = 4;
      }
      next_power -= bonus;
    }
    const update_query = `UPDATE user SET WIN =${next_win}, LOSE =${next_lose}, POWER =${next_power}, STREAK =${next_streak}  WHERE ID=${teamid[i]}`;
    db.run(update_query, function (err) {
      if (err) {
        console.log(err.message);
      }
    });
  }
  db.close();
};

insertNewUser = function (id, name) {
  const db = new sqlite3.Database(
    "./hr_db.db",
    sqlite3.OPEN_READWRITE,
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  const query = `INSERT INTO user(ID,NAME,WIN,LOSE,POWER,STREAK) VALUES(${id},"${name}",0,0,1000,0)`;
  db.run(query, function (err) {
    if (err) {
      console.log(err.message);
    }
  });
  db.close();
};

getUser = async function (id, name) {
  const db = new sqlite3.Database(
    "./hr_db.db",
    sqlite3.OPEN_READWRITE,
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  const find_query = `SELECT * from user WHERE ID=${id}`;
  const user_data = await new Promise((resolve) => {
    db.get(find_query, (err, rows) => {
      if (err) {
        resolve({ error: "error message" });
      } else {
        resolve(rows);
      }
    });
  });
  db.close();
  if (user_data != undefined) {
    return user_data;
  } else {
    insertNewUser(id, name);
    return { ID: id, NAME: name, WIN: 0, LOSE: 0, POWER: 1000, STREAK: 0 };
  }
};

exports.calculTeamValue = async function (teamIDs, teamNames) {
  var teampower = 0;
  for (i = 0; i < teamIDs.length; i++) {
    user_data = await getUser(teamIDs[i], teamNames[i]);
    teampower += user_data["POWER"];
  }
  return teampower;
};

exports.getAllUserData = async function () {
  const db = new sqlite3.Database(
    "./hr_db.db",
    sqlite3.OPEN_READWRITE,
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  const find_query = `SELECT * from user`;
  const user_data = await new Promise((resolve) => {
    db.all(find_query, (err, rows) => {
      if (err) {
        resolve({ error: "error message" });
      } else {
        resolve(rows);
      }
    });
  });
  db.close();
  let allData = [];
  user_data.forEach((item) => {
    const percent = Math.round(
      (item["WIN"] / (item["LOSE"] + item["WIN"])) * 100
    );
    percent.toFixed(1);
    allData.push({
      name: `${item["NAME"]}`,
      value: `${item["WIN"]} - ${item["LOSE"]} / ${percent}% / ${item["POWER"]} LP`,
    });
  });
  allData.sort(function (a, b) {
    if (a.name > b.name) return 1;
    else return -1;
  });
  return allData;
};

exports.getTop3 = async function (desc) {
  const db = new sqlite3.Database(
    "./hr_db.db",
    sqlite3.OPEN_READWRITE,
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  const find_query = `SELECT * from user`;
  const user_data = await new Promise((resolve) => {
    db.all(find_query, (err, rows) => {
      if (err) {
        resolve({ error: "error message" });
      } else {
        resolve(rows);
      }
    });
  });
  user_data.sort(function (a, b) {
    if (desc) {
      if (a["POWER"] < b["POWER"]) {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (a["POWER"] > b["POWER"]) {
        return 1;
      } else {
        return -1;
      }
    }
  });
  top3List = [];
  if (user_data.length < 3) {
    for (i = 0; i < user_data.length; i++) {
      top3List.push(user_data[i]);
    }
    for (i = 0; i < 3 - user_data.length; i++) {
      top3List.push({
        NAME: "no one",
        POWER: 0,
      });
    }
  } else {
    for (i = 0; i < 3; i++) {
      top3List.push(user_data[i]);
    }
  }
  db.close();
  return top3List;
};

exports.searchUser = async function (userName, isName = true) {
  const args = isName ? "NAME" : "ID";
  const db = new sqlite3.Database(
    "./hr_db.db",
    sqlite3.OPEN_READWRITE,
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  const search_query = `SELECT * from user WHERE ${args} = '${userName}'`;
  const user_data = await new Promise((resolve) => {
    db.all(search_query, (err, rows) => {
      if (err) {
        resolve({ error: "error message" });
      } else {
        resolve(rows);
      }
    });
  });
  return user_data;
};

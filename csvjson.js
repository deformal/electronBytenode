const csv2json = require("csvtojson");
const json2csv = require("json2csv").parse;
const fs = require("fs");

csv2json()
  .fromFile("./superhero.csv")
  .then((result) => {
    console.log(result);
    result.push({
      id: "4",
      name: "batman",
      powers: "money",
      gender: "male",
    });
    const csv = json2csv(result, {
      fields: ["id", "name", "powers", "gender"],
    });
    fs.writeFileSync("./superhero2.csv", csv);
  });

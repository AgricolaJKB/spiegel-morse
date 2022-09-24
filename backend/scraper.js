import { XMLParser } from "fast-xml-parser";
import fetch from "node-fetch";
import fs from "fs";

const parser = new XMLParser();

async function main() {
  const response = await fetch(
    "https://www.spiegel.de/schlagzeilen/tops/index.rss"
  );
  const text = await response.text();
  const data = await parser.parse(text);
  console.log(data.rss.channel.item);
  if (data.rss.channel.item) {
    const items = JSON.stringify(data.rss.channel.item);
    fs.writeFile("./public/headlines.json", items, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    });
  } else {
    console.log("RSS feed did not contain expected items");
  }
}

main();

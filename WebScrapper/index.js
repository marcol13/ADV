const express = require("express");
const axios = require("axios");
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

const PORT = 8005;
const url = "https://valorant.fandom.com/wiki/Weapons";
const base = "https://valorant.fandom.com";

function WeaponData(name, cost, damage) {
	this.name = name;
	this.cost = cost;
	this.damage = damage;
	if (this.cost == 0) this.ratio = 0;
	else this.ratio = damage / cost;
}

let weaponsList = new Array();

const app = express();

async function main() {
	const sites = await axios
		.get(url)
		.then((response) => {
			const dom = new JSDOM(response.data);
			const weapons = dom.window.document.querySelectorAll(
				"table.wikitable div.floatnone a"
			);
			let weaponsURL = Array.from(weapons);
			return (weaponsURL = weaponsURL.map((x) => {
				return x.getAttribute("href");
			}));
		})
		.catch((err) => console.log("Something went wrong!\n", err));

	// console.log(sites);

	for (const el of sites) {
		await axios(base + el).then((response) => {
			const dom = new JSDOM(response.data);

			const regDamage = new RegExp("(?<=(Body|Front).*?)[0-9]+");

			let infoDamage = dom.window.document.querySelector(
				"div.pi-smart-data-value"
			).innerHTML;

			infoDamage = parseInt(infoDamage.match(regDamage)[0]) || 0;

			let infoName = dom.window.document
				.querySelector("#firstHeading")
				.innerHTML.trim();

			let infoCost = dom.window.document.querySelector(
				"div[data-source='credits'] div.pi-data-value"
			);

			try {
				infoCost = parseInt(infoCost.innerHTML.replace(",", ""));
				if (!infoCost) {
					infoCost = 0;
				}
			} catch (e) {
				infoCost = 0;
			}

			let weapon = new WeaponData(infoName, infoCost, infoDamage);

			weaponsList.push(weapon);
		});
	}

	weaponsList.sort((a, b) => {
		if (a.ratio < b.ratio) return 1;
		if (a.ratio > b.ratio) return -1;
		return 0;
	});
	console.log(weaponsList);
}

main();

app.listen(PORT, () => console.log(`Server is running...`));

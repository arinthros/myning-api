#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const process = require('process')
const { parse } = require('yaml')

console.log('Importing data from myning')

const srcpath = path.join(process.cwd(), 'myning' , 'myning')
const outpath = path.join(process.cwd(), 'prisma')

// Mines
const minesFile = fs.readFileSync(path.join(srcpath, 'mines.yaml'), 'utf8');
const minesData = parse(minesFile);

const mines = Object.entries(minesData).reduce((outputArray, [name, mine]) => {
  if (mine) {
    outputArray.push({ name, type: mine.type });
  }
  return outputArray;
}, []);

const output = {
  mines,
}


fs.writeFileSync(path.join(outpath, 'data.json'), JSON.stringify(output, null, 2))
#!/usr/bin/env ts-node

import prisma from "../lib/prisma";
import data from './data.json';

async function seed() {
  const promises = data.mines.map((mine) => prisma.mine.upsert({
    where: { name: mine.name },
    create: { name: mine.name, type: mine.type },
    update: { type: mine.type }
  }));

  await Promise.all(promises)
}

console.log('Seeding data')

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
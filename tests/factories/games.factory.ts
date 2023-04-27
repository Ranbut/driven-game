import { faker } from '@faker-js/faker';
import prisma from 'config/database';

export async function createGame(consoleId: number, title?:string) {
  return await prisma.game.create({
    data: {
        title: title || faker.random.word(),
        consoleId
    },
  });
}
import { faker } from '@faker-js/faker';
import prisma from 'config/database';

export async function createConsole(name?: string) {
  return await prisma.console.create({
    data: {
        name: name || faker.random.word(),
    },
  });
}
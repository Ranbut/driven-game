import supertest from "supertest";
import app from '../../src/app';
import httpStatus from "http-status";
import { Game } from "@prisma/client";
import { createGame } from "../factories/games.factory";
import { cleanDb } from "../helpers";
import { createConsole } from "../factories/console.factory";
import { faker } from "@faker-js/faker";

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /games', () => {
    it('return all games with status 200', async () => {
        
      const createdConsole = await createConsole();
      await createGame(createdConsole.id);

      const response = await server.get(`/games`);

      const games = response.body as Game[];
      expect(games).toHaveLength(1);

      expect(response.status).toBe(httpStatus.OK);
      expect(games).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            consoleId: expect.any(Number),
          }),
        ])
      );
    })
  });
  
  describe('GET /games/:id', () => {
    it("should get the game and return status 200", async () => {

        const createdConsole = await createConsole();
        const createdGame = await createGame(createdConsole.id);

        const response = await server.get(`/games/${createdGame.id}`);

        expect(response.status).toBe(httpStatus.OK);
    
        const game = response.body as Game;
        
        expect(game).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            consoleId: expect.any(Number),
          })
        );
      });

      it("return status 404 with id that does not exists", async () => {

        const response = await server.get(`/games/1`);
    
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  });

  describe('POST /games', () => {
    it("return status 201 when created a game", async () => {

        const createdConsole = await createConsole();

        const bodyObj = {
          title: faker.random.word(),
          consoleId: createdConsole.id
        }
        
        const response = await server.post(`/games`).send(bodyObj);

        console.log(response.body);
        expect(response.status).toBe(httpStatus.CREATED);
      });

      it("return status 404 when console does not exist", async () => {
        
        const bodyObj = {
          title: faker.random.word(),
          consoleId: 1
        }
        
        const response = await server.post(`/games`).send(bodyObj);

        expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it("return status 409 when game already exist", async () => {

        const createdConsole = await createConsole();

        await createGame(createdConsole.id, "Super Mario World");

        const bodyObj = {
          title: "Super Mario World",
          consoleId: createdConsole.id
        }
        
        const response = await server.post(`/games`).send(bodyObj);

        expect(response.status).toBe(httpStatus.CONFLICT);
    });
  });
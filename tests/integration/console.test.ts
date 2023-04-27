import supertest from "supertest";
import app from '../../src/app';
import httpStatus from "http-status";
import { Console } from "@prisma/client";
import { cleanDb } from "../helpers";
import { createConsole } from "../factories/console.factory";
import { faker } from "@faker-js/faker";

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /consoles', () => {
    it('return all consoles with status 200', async () => {
        
      await createConsole();

      const response = await server.get(`/consoles`);

      const console = response.body as Console[];
      expect(console).toHaveLength(1);

      expect(response.status).toBe(httpStatus.OK);
      expect(console).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        ])
      );
    })
  });
  
  describe('GET /consoles/:id', () => {
    it("should get the console and return status 200", async () => {

        const createdConsole = await createConsole();

        const response = await server.get(`/consoles/${createdConsole.id}`);

        expect(response.status).toBe(httpStatus.OK);
    
        const console = response.body as Console;
        
        expect(console).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          })
        );
      });

      it("return status 404 with id that does not exists", async () => {

        const response = await server.get(`/consoles/1`);
    
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  });

  describe('POST /consoles', () => {
    it("return status 201 when created a console", async () => {

        const bodyObj = {
            name: faker.random.word()
        }
        
        const response = await server.post(`/consoles`).send(bodyObj);

        expect(response.status).toBe(httpStatus.CREATED);
      });

    it("return status 409 when console already exist", async () => {

        await createConsole("Super Nintendo");

        const bodyObj = {
            name: "Super Nintendo"
        }
        
        const response = await server.post(`/consoles`).send(bodyObj);

        console.log(response.body);
        expect(response.status).toBe(httpStatus.CONFLICT);
    });
  });
const app = require("../app");

const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});
describe("GET /api/topics", () => {
  test("to got all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),

          });
        });
      });
  })
  test("GET:404 responds with an appropriate status and error message when given a non-existent api", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
})
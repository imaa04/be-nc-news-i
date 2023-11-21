const app = require("../app");

const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const endpoints = require('../endpoints.json')
beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});
describe("GET /api/topics", () => {
  test("to get all the topics", () => {
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
describe("GET /api", () => {
    test("200: returns a json object", () => {
       return request(app)
       .get('/api')
       .expect(200)
       .then((response) => {
        expect(response.body.endpoints).toEqual(endpoints);
       })
      });
});
describe("/api/articles/:article_id", () => {
  test("GET: 200 sends an article by its id", () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then((response) => {
      console.log(response.body)
      expect(response.body.article.article_id).toBe(1);
        expect(response.body.article.title).toBe('Living in the shadow of a great man');
        expect(response.body.article.topic).toBe('mitch')
        expect(response.body.article.author).toBe('butter_bridge')
        expect(response.body.article.body).toBe('I find this existence challenging')
        expect(response.body.article.created_at).toBe('2020-07-09T20:11:00.000Z')
        expect(response.body.article.votes).toBe(100)
       })
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/99')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
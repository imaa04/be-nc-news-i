const app = require("../app");

const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");
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
  });
  test("GET:404 responds with an appropriate status and error message when given a non-existent api", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
});
describe("GET /api", () => {
  test("200: returns a json object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toEqual(endpoints);
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("GET: 200 sends an article by its id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(1);
        expect(response.body.article.title).toBe("Living in the shadow of a great man");
        expect(response.body.article.topic).toBe("mitch");
        expect(response.body.article.author).toBe("butter_bridge");
        expect(response.body.article.body).toBe("I find this existence challenging");
        expect(response.body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(response.body.article.votes).toBe(100);
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
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
describe("/api/articles", () => {
  test("GET: 200 sends the articles and they should be sorted by date in descending order with no body property present", () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response)=> {
      const articles = response.body.articles
      console.log(articles)
      expect(articles).toHaveLength(13)
      articles.forEach(article => {
        expect(article).toMatchObject({
        article_id: expect.any(Number),
        author: expect.any(String),
        title: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number)
      })
      })
    })
  })
  test("GET: 200 sends the articles sorted by date in descending order", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((response) => {
      const articles = response.body.articles
      expect(articles.at(0).article_id).not.toBe(1)
      expect(articles.at(0).created_at).toBe("2020-11-03T09:12:00.000Z");
    })
  })
  
});
describe("/api/articles/:article_id/comments", () => {
  test("get all comments for a specified article", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body}) => {
      const {comments} = body;
      expect(comments).toHaveLength(11);
      comments.forEach(comment => {
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        body: expect.any(String),
        article_id: expect.any(Number),
        author: expect.any(String),
        votes: expect.any(Number),
        created_at: expect.any(String)
      })  
      })
      });
  });

  test("GET:404 sends an appropriate status and error message when article id given is valid but non-existen id", () => {
        return request(app)
        .get("/api/articles/99/comments")
        .expect(404)
        .then((response) => {
        expect(response.body.msg).toBe("this article doesn't have a comment");
      });
})
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
    .get("/api/articles/banana/comments")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request");
    });
})
  test("GET:404 sends an appropriate status and error message when given valid ID but the article has no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("this article doesn't have a comment");
      });
  });
})
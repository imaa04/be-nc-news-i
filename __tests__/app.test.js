const app = require("../app");

const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");
beforeEach(() => {
  return seed(testData);
});

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
        expect(response.body.article.title).toBe(
          "Living in the shadow of a great man"
        );
        expect(response.body.article.topic).toBe("mitch");
        expect(response.body.article.author).toBe("butter_bridge");
        expect(response.body.article.body).toBe(
          "I find this existence challenging"
        );
        expect(response.body.article.created_at).toBe(
          "2020-07-09T20:11:00.000Z"
        );
        expect(response.body.article.votes).toBe(100);
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article_id does not exist");
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
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET: 200 sends the articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.at(0).article_id).not.toBe(1);
        expect(articles.at(0).created_at).toBe("2020-11-03T09:12:00.000Z");
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("get all comments for a specified article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });

  test("GET:404 sends an appropriate status and error message when article id given is valid but non-existen id", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("this article_id doesn't exist");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("GET:200 responds with an empty array when given valid ID but the article has no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toStrictEqual([]);
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with a new comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This article is lit!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment.author).toBe("butter_bridge");
        expect(response.body.comment.body).toBe("This article is lit!");
        expect(response.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("POST:404 sends an appropriate status and error message when article id given is valid but non-existen id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This article is lit!",
    };
    return request(app)
      .post("/api/articles/99/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("this article_id doesn't exist");
      });
  });
  test("POST:400 responds with a message when given an invalid id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This article is lit!",
    };
    return request(app)
      .post("/api/articles/bad_id/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST:400 responds with an error message when missing required fields e.g. body property or username", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request: Missing required fileds");
      });
  });
  test("POST:404 sends an appropriate status and error message when username given doesn't exist", () => {
    const newComment = {
      username: "johnny_bravo04",
      body: "This article is lit!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found: username does not exist");
      });
  });
  test("201: ignores unnecessary fields", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This article is lit!",
      votes: 12,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment.author).toBe("butter_bridge");
        expect(response.body.comment.body).toBe("This article is lit!");
        expect(response.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with specified updated article and votes increments", () => {
    const newVoteChange = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/2")
      .send(newVoteChange)
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.article_id).toBe(2);
        expect(article.title).toBe("Sony Vaio; or, The Laptop");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("icellusedkars");
        expect(typeof article.body).toBe("string");
        expect(article.created_at).toBe("2020-10-16T05:03:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  })
  test("200: responds with specified updated article and votes decrements", () => {
    const newVoteChange = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/2")
      .send(newVoteChange)
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.article_id).toBe(2);
        expect(article.title).toBe("Sony Vaio; or, The Laptop");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("icellusedkars");
        expect(typeof article.body).toBe("string");
        expect(article.created_at).toBe("2020-10-16T05:03:00.000Z");
        expect(article.votes).toBe(-10);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    const newVoteChange = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/99")
      .send(newVoteChange)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article_id does not exist");
      });
  });
  test("PATCH:400 sends an appropriate status and error message when given an invalid id", () => {
    const newVoteChange = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/not-an-article")
      .send(newVoteChange)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("PATCH:400 responds with an error message when missing required fields e.g. body property or username", () => {
    const newVoteChange = {};
    return request(app)
      .patch("/api/articles/1")
      .send(newVoteChange)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request: Missing required fileds");
      });
  });
  test("PATCH 200: ignores unnecessary fields", () => {
    const newVoteChange = {
      inc_votes: 10,
      topic: "mitch",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVoteChange)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  })
})
describe("DELETE /api/comments/:comment_id", () => {
  test('204: responds with no content for the specified comment', () => {
    return request(app)
    .delete("/api/comments/4")
    .expect(204)
    .then((response) => {
      expect(response.body).toEqual({})
      expect(Object.keys(response.body).length).toBe(0)
    })
  })
    test("DELETE:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
      return request(app)
        .delete("/api/comments/99")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("this comment_id does not exist");
        });
    });
    test("DELETE:400 sends an appropriate status and error message when given an invalid id", () => {
      return request(app)
        .delete("/api/comments/not-a-comment")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
  });

describe("GET /api/users", () => {
  test('200: responds with all the users', () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({ body }) => {
      const users = body.users;
      expect(users).toHaveLength(4);
      users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        });
      });
    })
  })
  test("GET:404 responds with an appropriate status and error message when given a non-existent api", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
});
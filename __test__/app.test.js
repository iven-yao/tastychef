const request = require('supertest');
const app = require('../app');

describe("Test all paths", () => {
    test("/", done => {
        request(app)
        .get("/")
        .then(response => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test("/search", done => {
        request(app)
        .get("/search")
        .then(response => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test("/country", done => {
        request(app)
        .get("/country")
        .then(response => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test("/favorite", done => {
        request(app)
        .get("/favorite")
        .then(response => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test("/about", done => {
        request(app)
        .get("/about")
        .then(response => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe("Test TheMealDB API Calls", () => {
    test("search Call", async () => {
        const response = await request(app).get("/api/search?q=Arrabiata");
        expect(response.statusCode).toBe(200);
    });

    test("random Call", async () => {
        const response = await request(app).get("/api/random");
        expect(response.statusCode).toBe(200);
    });

    test("detail Call", async () => {
        const response = await request(app).get("/api/detail?id=52772");
        expect(response.statusCode).toBe(200);
    });
});
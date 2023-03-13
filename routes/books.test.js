process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testBook;

beforeEach(async function () {
    console.log('testing************************')
    testDB = await db.query(`SELECT * FROM books`);
    console.log('i am test db###########################', testDB)
    const result = await db.query(`INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) VALUES ('1', 'https:www.b-jam.com', 'Brent Jameson', 'English', 79, 'pound the rock publishing', 'B-Jam', 2023) RETURNING isbn, amazon_url, author, language, pages, publisher, title, year`);
    console.log('i am beforeeach testbook%%%%%%%%%%%%%%%%%%%%%%%%%%%%', testBook)
    testBook = result.rows[0]
})

afterEach(async function () {
    await db.query('DELETE FROM books')
})

afterAll(async () => {
    await db.end()
})

describe("GET /books", () => {
    test("Get all books", async () => {
        console.log('i am test book',testBook)
        const res = await request(app).get("/books");
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({"books": [{
            isbn: '1',
            amazon_url: 'https:www.b-jam.com',
            author: 'Brent Jameson',
            language: 'English',
            pages: 79,
            publisher: 'pound the rock publishing',
            title: 'B-Jam',
            year: 2023
          }]})
    })
})


describe("POST /books", () => {
    const newBook = {
        isbn: "2",
        amazon_url: "https:www.newbook.com",
        author: "Steve Nash",
        language: "English",
        pages: 150,
        publisher: "pound the rock publishing",
        title: "How To Make An Assist",
        year: 2002
      }
    test("Create new book", async function () {
        const res = await request(app).post("/books").send(newBook)
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({"book": newBook})
    })
    test("Fails with improper 'type' entered", async function () {
        newBook.pages = "a lot pages"
        const res = await request(app).post("/books").send(newBook)
        console.log("i am res*******************", res.text)
        expect(res.statusCode).toBe(400)
    })
})

describe("PUT /books/:isbn", () => {
    // Edit the number of pages in testBook from 79 to 89
    const bookEdits = {
        isbn: '1',
        amazon_url: 'https:www.b-jam.com',
        author: 'Brent Jameson',
        language: 'English',
        pages: 89,
        publisher: 'pound the rock publishing',
        title: 'B-Jam',
        year: 2023
      }
    test("Edit the number of pages of a book", async function () {
        const res = await request(app).put("/books/1").send(bookEdits)
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({"book": bookEdits})
    })
})


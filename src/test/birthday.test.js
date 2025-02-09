const request = require("supertest");
const app = require("../app");
const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
const { pool } = require("../config/db");
const { faker } = require("@faker-js/faker");
const { generateFakeUser } = require("../utils/fakerHelper");
dayjs.extend(utc);

describe("birthDayAndGift API", () => {
  // before
  beforeAll(async () => {
    await pool.query("truncate gifts restart identity");
    await pool.query("truncate users restart identity");

    const addUserQuery = `
      INSERT INTO users (name, email, birthdate) VALUES ($1,$2,$3);
    `;

    for (let i = 1; i <= 10; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email();
      let birthdate = new Date(
        faker.date.birthdate({ mode: "age", min: 18, max: 70 })
      );
      if (i <= 5) {
        // Set bd to todays month and date
        birthdate.setMonth(dayjs().get("month"), dayjs().get("date"));
      } else {
        // Ensure bd is not today
        do {
          birthdate = new Date(
            faker.date.birthdate({ mode: "age", min: 18, max: 70 })
          );
        } while (
          birthdate.getMonth() === dayjs().get("month") &&
          birthdate.getDate() === dayjs().get("date")
        );
      }
      await pool.query(addUserQuery, [name, email, birthdate]);
    }
  });

  let userData;
  // let day = dayjs().utcOffset(7);

  it("should get all user that birth on the given date", async () => {
    // 10 = 5
    // const m = dayjs().utcOffset(7);
    // const m1 = dayjs(m).utcOffset(7).toISOString();
    // dayjs.extend(utc);
    // const a = dayjs().add(7, 'h');
    // console.log(`m:${dayjs(a).format()}}`)
    // console.log(`m:${dayjs(dayjs(m).format()).get('month')}`)

    const utctime = dayjs().utcOffset(7).format();
    // console.log("🚀 ~ describe ~ utctime:", utctime)
    const month = dayjs(dayjs().utcOffset(7)).get("month") + 1;
    // console.log("🚀 ~ describe ~ month:", month)
    const date = dayjs().get("date");
    const res = await request(app).get(
      `/api/birthdays?month=${month}&date=${date}`
    );
    // console.log(res.body);
    userData = res.body;
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(5);
    res.body.forEach((item) => {
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("email");
      expect(item).toHaveProperty("birthdate");
    });
    // counting total 10
    // counting total 5
  });

  it("should send birthday gift to provided users data", async () => {
    const users = { users: userData };
    const res = await request(app).post("/api/send-gifts").send(users);
    // console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.reqCount).toEqual(5);
    expect(res.body.giftCount).toEqual(5);
    expect(res.body.skipCount).toEqual(0);
    // count get user 5
    // count execute 5
  });

  it("should skip send birthday gift to provided users data", async () => {
    const users = { users: userData };
    const res = await request(app).post("/api/send-gifts").send(users);
    // console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.reqCount).toEqual(5);
    expect(res.body.giftCount).toEqual(0);
    expect(res.body.skipCount).toEqual(5);
    // count get user 5
    // count execute 5
  });

  it("should execute when the users array is empty", async () => {
    const users = { users: [] };
    const res = await request(app).post("/api/send-gifts").send(users);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("At least one user is required");
  });

  it("should throw 400 bad request when the req.body is empty", async () => {
    const res = await request(app).post("/api/send-gifts");
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("Users is required");
  });

  it('should throw 400 when users is not list of object', async () => {
    const users = {
      users: [1]
    };

    const res = await request(app).post("/api/send-gifts").send(users);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("users must be list of object");  
  })

  it('should throw 400 when the users is empty object', async () => {
    const users = {
      users: [{}]
    };

    const res = await request(app).post("/api/send-gifts").send(users);
    console.log("🚀 ~ it ~ res:", res)
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("ID is required");  
  })


  it('should throw 400 when the users.id is not number', async () => {
    const users = {
      users: [
        {
          id:"asd",
        }
      ]
    };

    const res = await request(app).post("/api/send-gifts").send(users);
    console.log("🚀 ~ it ~ res:", res)
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("ID must be number");  
  })

  it('should throw 400 when the users.name is empty', async () => {
    const users = {
      users: [
        {
          id:1,
          email:"test@tes.com",
          birthdate: dayjs().toISOString(),
        }
      ]
    };

    const res = await request(app).post("/api/send-gifts").send(users);
    console.log("🚀 ~ it ~ res:", res)
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("name is required");  
  })

  it('should throw 400 when the users.name is not string', async () => {
    const users = {
      users: [
        {
          id:1,
          name: 1,
          email:"test@tes.com",
          birthdate: dayjs().toISOString(),
        }
      ]
    };

    const res = await request(app).post("/api/send-gifts").send(users);
    console.log("🚀 ~ it ~ res:", res)
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("name must be string");  
  })

  it('should throw 400 when the users.email is not provide', async () => {
    const users = {
      users: [
        {
          id:1,
          name: "asdad",
          // email:"test@tes.com",
          birthdate: dayjs().toISOString(),
        }
      ]
    };

    const res = await request(app).post("/api/send-gifts").send(users);
    console.log("🚀 ~ it ~ res:", res)
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("email is required");  
  })

  it('should throw 400 when the users.email is not string', async () => {
    const users = {
      users: [
        {
          id:1,
          name: "asdad",
          email:123,
          birthdate: dayjs().toISOString(),
        }
      ]
    };

    const res = await request(app).post("/api/send-gifts").send(users);
    console.log("🚀 ~ it ~ res:", res)
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("email must be string");  
  })

  it('should throw 400 when the users.birthdate is not provide', async () => {
    const users = {
      users: [
        {
          id:1,
          name: "asdad",
          email:"test@tes.com",
          // birthdate: dayjs().toISOString(),
        }
      ]
    };

    const res = await request(app).post("/api/send-gifts").send(users);
    console.log("🚀 ~ it ~ res:", res)
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("birthdate is required");  
  })

  it('should throw 400 when the users.birthdate is not provide', async () => {
    const users = {
      users: [
        {
          id:1,
          name: "asdad",
          email:"test@tes.com",
          birthdate: "dayjs().toISOString()",
        }
      ]
    };

    const res = await request(app).post("/api/send-gifts").send(users);
    console.log("🚀 ~ it ~ res:", res)
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("birthdate must be in ISO 8601 date format");  
  })

  //   after
});

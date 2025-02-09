const { pool } = require("../config/db");
const dayjs = require("dayjs");
const { getBDQuerySchema,sendGiftsReqValidation } = require("../utils/validation");

const getBirthDayUsers = async (req, res) => {
  try {
    const { error, value } = getBDQuerySchema.validate(req.query);
    // console.log("value:", value);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { month } =
      req.query === undefined ? dayjs().get("month") + 1 : req.query;
    const { date } = req.query === undefined ? dayjs().get("date") : req.query;

    const query = `
        SELECT * 
        FROM users u
        WHERE EXTRACT(MONTH FROM u.birthdate) = $1
        AND EXTRACT(DAY FROM u.birthdate) = $2
        AND NOT EXISTS (
            SELECT * FROM gifts g
            WHERE g.user_id = u.id
            AND EXTRACT(YEAR FROM g.sent_at) = EXTRACT(YEAR FROM NOW()));
        `;

    const { rows } = await pool.query(query, [month, date]);
    rows.forEach((row) => {
      row.birthdate = dayjs(row.birthdate).toISOString().split("T")[0]; // Just the date part (YYYY-MM-DD)
    });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendGifts = async (req, res) => {
  const reqBody = req.body;
  const {error} = sendGiftsReqValidation.validate(req.body)
  if(error){
    return res.status(400).json({ error: error.details[0].message });
  }
  const { users } = req.body;
  // if (users === undefined) return res.status(400).json({ error: "The request value must not be empty" });
  // console.log(typeof users)
  try {
    const reqCount = users.length;
    let giftCount = 0;
    let skipCount = 0;
    for (const user of users) {
      const checkQuery = `
                SELECT * FROM gifts
                WHERE user_id = $1
                AND EXTRACT(YEAR FROM sent_at) = EXTRACT(YEAR FROM NOW());
            `;
      const { rows } = await pool.query(checkQuery, [user.id]);
      if (rows.length === 0) {
        await pool.query(`INSERT INTO gifts(user_id) VALUES ($1)`, [user.id]);
        // console.log(`Success : Gift sent successfully to ${user.name}`);
        giftCount++;
        // responses.push(`Gift sent successfully to ${user.name}`);
      } else {
        // console.log(`Skip : User ${user.name} already received a gift this year`);
        // responses.push(`User ${user.name} already received a gift this year`);
        skipCount++;
      }
    }
    res.status(200).json({
      reqCount: reqCount,
      giftCount: giftCount,
      skipCount: skipCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getBirthDayUsers, sendGifts };

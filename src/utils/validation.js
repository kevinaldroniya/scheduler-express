const Joi = require("joi");

const getBDQuerySchema = Joi.object({
  month: Joi.number().integer().min(1).max(12).messages({
    "number.base": "Month must be a number",
    "number.min": "Month cannot be less than 1",
    "number.max": "Month cannot be more than 12",
    // "any.required": "Month is required",
  }),

  date: Joi.number().integer().min(1).max(31).messages({
    "number.base": "Date must be a number",
    "number.min": "Date cannot be less than 1",
    "number.max": "Date cannot be more than 31",
  }),
});

const sendGiftsReqValidation = Joi.object({
  users: Joi.array()
    .items(
      Joi.object(
        {
        id: Joi.number().integer().required().messages({
          "number.base": "ID must be number",
          "any.required": "ID is required",
          "array.min": "At least one user is required",
        }),
        name: Joi.string().required().messages({
          "string.base": "name must be string",
          "any.required": "name is required",
          "array.min": "At least one user is required",
        }),
        email: Joi.string().required().email().messages({
          "string.base": "email must be string",
          "any.required": "email is required",
          "array.min": "At least one user is required",
        }),
        birthdate: Joi.date().iso().required().messages({
          "date.format": "birthdate must be in ISO 8601 date format",
          "any.required": "birthdate is required",
          "array.min": "At least one user is required",
        }),
      }
    )
        .messages({
          "object.base": "users must be list of object",
          "array.min": "At least one user is required",
        })
    ).min(1).required().messages({
      "array.base": "Users must be an array",
      "any.required": "Users is required",
      "array.min": "At least one user is required",
      // Error for empty array case
    }),
});

// const fiveTeenYearsAgo = new Date(now().setFullYear(now.getFullYear() - 15));

// const usersDTO = Joi.object({
//   name: Joi.string().messages({
//     "string.empty": "Email must not be empty",
//   }),
//   email: Joi.string()
//     .email({
//       minDomainSegments: 2,
//     })
//     .messages({
//       "string.email":
//         "Please provide a valid email address with a valid domain (e.g., example@domain.com)",
//       "string.base": "The email must be a string.",
//       "string.empty": "Email must not be empty",
//     }),
//   birthDate: Joi.date()
//     .less(fiveTeenYearsAgo)
//     .messages({
//       "date.base": "The input must be a valid date.",
//       "date.less": `The date must be earlier than ${fiveTeenYearsAgo.toDateString()}.`,
//     }),
// });

module.exports = { getBDQuerySchema, sendGiftsReqValidation };

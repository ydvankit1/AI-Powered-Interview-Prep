/** @type  {import ("drizzle-kit").config} */

export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://neondb_owner:S7Ei2GFWxqrK@ep-lively-dew-a5qj6bin.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
  }
};
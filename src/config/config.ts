import * as dotenv from 'dotenv';

dotenv.config();

export const mongoConnectionString: string =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI
    : 'mongodb://localhost:27017/url-shortener';

export const isDevelopment: boolean =
  process.env.NODE_ENV === 'production' ? false : true;

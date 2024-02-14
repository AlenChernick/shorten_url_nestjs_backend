import { Document } from 'mongoose';

export interface UrlDocument extends Document {
  originalUrl: string;
  shortenedUrl: string;
}

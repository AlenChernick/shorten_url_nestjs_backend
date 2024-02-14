import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlDocument } from './url.interface';
import { ShortenUrlDto } from './dto/shorten-url.dto/shorten-url.dto';
import * as shortid from 'shortid';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel('Url') private readonly urlModel: Model<UrlDocument>,
  ) {}

  async shortenUrl(
    shortenUrlDto: ShortenUrlDto,
  ): Promise<{ shortenedUrl: string }> {
    try {
      const { url } = shortenUrlDto;
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname;

      const shortenedDomain = await this.dnsLookup(domain);

      if (shortenedDomain) {
        const shortenedUrl = shortid.generate();
        await this.urlModel.create({ originalUrl: url, shortenedUrl });
        return { shortenedUrl };
      }

      return null;
    } catch (error) {
      console.error(`POST: UrlService-shortenUrl  ${error.message}`);
      return null;
    }
  }

  async getOriginalUrl(shortenedUrl: string): Promise<string> {
    try {
      const urlEntry = await this.urlModel.findOne({ shortenedUrl });

      if (urlEntry) {
        return urlEntry.originalUrl;
      }
      return null;
    } catch (error) {
      console.log(`GET: UrlService-getOriginalUrl ${error.message}`);
      return null;
    }
  }

  private async dnsLookup(domain: string): Promise<string> {
    try {
      const response = await fetch(`https://dns.google/resolve?name=${domain}`);
      const data = await response.json();
      if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
        return data.Answer[0].data;
      } else {
        throw new Error('DNS lookup failed or returned no results');
      }
    } catch (error) {
      console.error(`GET: UrlService-dnsLookup ${error.message}`);
      return null;
    }
  }
}

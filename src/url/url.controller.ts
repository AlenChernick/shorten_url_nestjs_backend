import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenUrlDto } from './dto/shorten-url.dto/shorten-url.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('short-url')
  async shortenUrl(
    @Body() shortenUrlDto: ShortenUrlDto,
  ): Promise<{ shortenedUrl: string }> {
    return await this.urlService.shortenUrl(shortenUrlDto);
  }

  @Get(':shortenedUrl')
  @Redirect('', 301)
  async redirect(
    @Param('shortenedUrl') shortenedUrl: string,
  ): Promise<{ url: string }> {
    const originalUrl = await this.urlService.getOriginalUrl(shortenedUrl);
    return { url: originalUrl };
  }

  @Get('original-url/:shortenedUrl')
  async originalUrl(
    @Param('shortenedUrl') shortenedUrl: string,
  ): Promise<{ url: string }> {
    const originalUrl = await this.urlService.getOriginalUrl(shortenedUrl);
    return { url: originalUrl };
  }
}

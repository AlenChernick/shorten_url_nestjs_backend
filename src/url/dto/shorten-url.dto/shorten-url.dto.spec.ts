import { ShortenUrlDto } from './shorten-url.dto';

describe('ShortenUrlDto', () => {
  it('should be defined', () => {
    const dto = new ShortenUrlDto();
    dto.url = 'test';
    expect(dto).toBeDefined();
  });

  it('should have a valid URL property', () => {
    const dto = new ShortenUrlDto();
    dto.url = 'http://example.com';
    expect(dto.url).toEqual('http://example.com');
  });
});

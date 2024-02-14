import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;
  let mockUrlService: any;

  beforeEach(async () => {
    mockUrlService = {
      shortenUrl: jest.fn().mockResolvedValue({ shortenedUrl: 'abc123' }),
      getOriginalUrl: jest.fn().mockResolvedValue('http://example.com'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should return shortened URL', async () => {
      const dto = { url: 'http://example.com' };
      const result = { shortenedUrl: 'abc123' };
      mockUrlService.shortenUrl.mockResolvedValue(result);

      const response = await controller.shortenUrl(dto);

      expect(response).toEqual(result);
    });

    it('should throw error if URL not found', async () => {
      const dto = { url: 'invalid_url' };
      mockUrlService.shortenUrl.mockRejectedValue(
        new Error('Original URL not found'),
      );

      await expect(controller.shortenUrl(dto)).rejects.toThrowError(
        'Original URL not found',
      );
    });
  });

  describe('redirect', () => {
    it('should redirect to original URL', async () => {
      const shortenedUrl = 'abc123';
      const originalUrl = 'http://example.com';
      jest.spyOn(service, 'getOriginalUrl').mockResolvedValue(originalUrl);

      const response = await controller.redirect(shortenedUrl);

      expect(response).toEqual({ url: originalUrl });
    });
  });

  describe('originalUrl', () => {
    it('should return original URL', async () => {
      const shortenedUrl = 'abc123';
      const originalUrl = 'http://example.com';
      jest.spyOn(service, 'getOriginalUrl').mockResolvedValue(originalUrl);

      const response = await controller.originalUrl(shortenedUrl);

      expect(response).toEqual({ url: originalUrl });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlDocument } from './url.interface';

// Mock the UrlDocument interface
jest.mock('./url.interface', () => ({
  UrlDocument: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock the UrlModel
const mockUrlModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

describe('UrlService', () => {
  let service: UrlService;
  let UrlModel: Model<UrlDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getModelToken('Url'),
          useValue: mockUrlModel,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    UrlModel = module.get<Model<UrlDocument>>(getModelToken('Url'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should shorten a URL', async () => {
      const urlDto = { url: 'http://example.com' };
      const mockUrlDocument: any = {
        originalUrl: urlDto.url,
        shortenedUrl: 'abc123',
      };

      jest.spyOn(service as any, 'dnsLookup').mockResolvedValue(true);

      UrlModel.create = jest.fn().mockResolvedValue(mockUrlDocument);

      const result = await service.shortenUrl(urlDto);
      mockUrlDocument.shortenedUrl = result.shortenedUrl;

      expect(UrlModel.create).toHaveBeenCalledWith({
        originalUrl: urlDto.url,
        shortenedUrl: expect.any(String),
      });

      expect(result.shortenedUrl).toEqual(mockUrlDocument.shortenedUrl);
    });
  });

  describe('getOriginalUrl', () => {
    it('should return original URL for a valid shortened URL', async () => {
      const shortenedUrl = 'abc123';
      const originalUrl = 'http://example.com';
      UrlModel.findOne = jest.fn().mockResolvedValue({ originalUrl });

      const result = await service.getOriginalUrl(shortenedUrl);

      expect(result).toEqual(originalUrl);
    });

    it('should return null if no original URL found', async () => {
      const shortenedUrl = 'invalid_shortened_url';
      UrlModel.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.getOriginalUrl(shortenedUrl);

      expect(result).toBeNull();
    });
  });
});

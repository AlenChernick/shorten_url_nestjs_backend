// src/middleware/redirect.middleware.spec.ts

import { RedirectMiddleware } from './redirect.middleware';
import { Request, Response } from 'express';

describe('RedirectMiddleware', () => {
  let middleware: RedirectMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    middleware = new RedirectMiddleware();
    mockRequest = {
      originalUrl: '/',
    };
    mockResponse = {
      redirect: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should redirect to the specified URL for root URL', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.redirect).toHaveBeenCalledWith(
      'https://shorten-url-yfhd.onrender.com',
    );
  });

  it('should call next middleware if the request is not for root URL', () => {
    mockRequest.originalUrl = '/other-url';
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});

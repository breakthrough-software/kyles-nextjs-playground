import handler from '../../pages/api/post/index'
import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth/next';
import prisma from '../../lib/prisma';
import { describe, expect } from '@jest/globals';

jest.mock('next-auth/next');
jest.mock('../../lib/prisma', () => ({
    __esModule: true,
    default: {
      post: {
        create: jest.fn(),
      },
    },
  }));
  
const mockedGetServerSession = jest.mocked(getServerSession);
const mockedPrisma = jest.mocked(prisma);

describe('/api/post API Route', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 401 if no session', async () => {
    mockedGetServerSession.mockResolvedValue(null);

    const { req, res } = createMocks({
      method: 'POST',
      body: { title: 'Test Title', content: 'Test Content' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Unauthorized - No valid session or user email',
    });
  });

  it('should create a post successfully if session is valid', async () => {
    const mockSession = { user: { email: 'test@example.com' } };
    mockedGetServerSession.mockResolvedValue(mockSession);

    const mockPost = {
      id: 'cm9iz7k8c0004xy2m8axwzq7g',
      title: 'Test Title',
      content: 'Test Content',
      published: false,
      authorId: 'cm9ipu5ch0000xy6dmhne4vpb',
    };

    mockedPrisma.post.create.mockResolvedValue(mockPost);

    const { req, res } = createMocks({
      method: 'POST',
      body: { title: 'Test Title', content: 'Test Content' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockPost);
    expect(prisma.post.create).toHaveBeenCalledWith({
      data: {
        title: 'Test Title',
        content: 'Test Content',
        author: { connect: { email: 'test@example.com' } },
      },
    });
  });

  it('should handle Prisma errors gracefully', async () => {
    const mockSession = { user: { email: 'test@example.com' } };
    mockedGetServerSession.mockResolvedValue(mockSession);

    mockedPrisma.post.create.mockRejectedValue(new Error('Database error'));

    const { req, res } = createMocks({
      method: 'POST',
      body: { title: 'Title', content: 'Content' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Failed to create post',
      error: 'Database error',
    });
  });
});
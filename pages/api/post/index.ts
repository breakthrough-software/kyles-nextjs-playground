import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { title, content } = req.body;

  const session = await getServerSession(req, res, authOptions);

  console.log('Session:', session);
  console.log('User email:', session?.user?.email);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'Unauthorized - No valid session or user email' });
  }

  try {
    const result = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { email: session.user.email } },
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { educationalResourceValidationSchema } from 'validationSchema/educational-resources';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getEducationalResources();
    case 'POST':
      return createEducationalResource();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEducationalResources() {
    const data = await prisma.educational_resource
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'educational_resource'));
    return res.status(200).json(data);
  }

  async function createEducationalResource() {
    await educationalResourceValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.educational_resource.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

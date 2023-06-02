import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { halalInvestmentProductValidationSchema } from 'validationSchema/halal-investment-products';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.halal_investment_product
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getHalalInvestmentProductById();
    case 'PUT':
      return updateHalalInvestmentProductById();
    case 'DELETE':
      return deleteHalalInvestmentProductById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getHalalInvestmentProductById() {
    const data = await prisma.halal_investment_product.findFirst(
      convertQueryToPrismaUtil(req.query, 'halal_investment_product'),
    );
    return res.status(200).json(data);
  }

  async function updateHalalInvestmentProductById() {
    await halalInvestmentProductValidationSchema.validate(req.body);
    const data = await prisma.halal_investment_product.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteHalalInvestmentProductById() {
    const data = await prisma.halal_investment_product.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

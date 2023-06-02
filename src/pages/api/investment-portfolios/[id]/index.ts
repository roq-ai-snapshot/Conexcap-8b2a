import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { investmentPortfolioValidationSchema } from 'validationSchema/investment-portfolios';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.investment_portfolio
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getInvestmentPortfolioById();
    case 'PUT':
      return updateInvestmentPortfolioById();
    case 'DELETE':
      return deleteInvestmentPortfolioById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInvestmentPortfolioById() {
    const data = await prisma.investment_portfolio.findFirst(
      convertQueryToPrismaUtil(req.query, 'investment_portfolio'),
    );
    return res.status(200).json(data);
  }

  async function updateInvestmentPortfolioById() {
    await investmentPortfolioValidationSchema.validate(req.body);
    const data = await prisma.investment_portfolio.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteInvestmentPortfolioById() {
    const data = await prisma.investment_portfolio.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { investmentPortfolioValidationSchema } from 'validationSchema/investment-portfolios';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getInvestmentPortfolios();
    case 'POST':
      return createInvestmentPortfolio();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInvestmentPortfolios() {
    const data = await prisma.investment_portfolio
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'investment_portfolio'));
    return res.status(200).json(data);
  }

  async function createInvestmentPortfolio() {
    await investmentPortfolioValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.investment?.length > 0) {
      const create_investment = body.investment;
      body.investment = {
        create: create_investment,
      };
    } else {
      delete body.investment;
    }
    const data = await prisma.investment_portfolio.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

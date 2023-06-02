import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getInvestmentById } from 'apiSdk/investments';
import { Error } from 'components/error';
import { InvestmentInterface } from 'interfaces/investment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function InvestmentViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InvestmentInterface>(
    () => (id ? `/investments/${id}` : null),
    () =>
      getInvestmentById(id, {
        relations: ['investment_portfolio', 'halal_investment_product'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Investment Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              amount: {data?.amount}
            </Text>
            {hasAccess('investment_portfolio', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                investment_portfolio:{' '}
                <Link href={`/investment-portfolios/view/${data?.investment_portfolio?.id}`}>
                  {data?.investment_portfolio?.id}
                </Link>
              </Text>
            )}
            {hasAccess('halal_investment_product', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                halal_investment_product:{' '}
                <Link href={`/halal-investment-products/view/${data?.halal_investment_product?.id}`}>
                  {data?.halal_investment_product?.id}
                </Link>
              </Text>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'investment',
  operation: AccessOperationEnum.READ,
})(InvestmentViewPage);

import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getInvestmentPortfolioById } from 'apiSdk/investment-portfolios';
import { Error } from 'components/error';
import { InvestmentPortfolioInterface } from 'interfaces/investment-portfolio';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteInvestmentById } from 'apiSdk/investments';

function InvestmentPortfolioViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InvestmentPortfolioInterface>(
    () => (id ? `/investment-portfolios/${id}` : null),
    () =>
      getInvestmentPortfolioById(id, {
        relations: ['user', 'investment'],
      }),
  );

  const investmentHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteInvestmentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Investment Portfolio Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                user: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.id}</Link>
              </Text>
            )}
            {hasAccess('investment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Investment
                </Text>
                <Link href={`/investments/create?investment_portfolio_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>amount</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.investment?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>{record.amount}</Td>
                          <Td>
                            <Button>
                              <Link href={`/investments/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/investments/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => investmentHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'investment_portfolio',
  operation: AccessOperationEnum.READ,
})(InvestmentPortfolioViewPage);

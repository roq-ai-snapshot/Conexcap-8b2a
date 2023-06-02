import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getInvestmentPortfolios, deleteInvestmentPortfolioById } from 'apiSdk/investment-portfolios';
import { InvestmentPortfolioInterface } from 'interfaces/investment-portfolio';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function InvestmentPortfolioListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<InvestmentPortfolioInterface[]>(
    () => '/investment-portfolios',
    () =>
      getInvestmentPortfolios({
        relations: ['user', 'investment.count'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteInvestmentPortfolioById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Investment Portfolio
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('investment_portfolio', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/investment-portfolios/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>id</Th>
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>user_id</Th>}
                  {hasAccess('investment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>investment</Th>}
                  {hasAccess('investment_portfolio', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                    <Th>Edit</Th>
                  )}
                  {hasAccess('investment_portfolio', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>View</Th>
                  )}
                  {hasAccess('investment_portfolio', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.id}</Td>
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/users/view/${record.user?.id}`}>{record.user?.id}</Link>
                      </Td>
                    )}
                    {hasAccess('investment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.investment}</Td>
                    )}
                    {hasAccess('investment_portfolio', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/investment-portfolios/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('investment_portfolio', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/investment-portfolios/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('investment_portfolio', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'investment_portfolio',
  operation: AccessOperationEnum.READ,
})(InvestmentPortfolioListPage);

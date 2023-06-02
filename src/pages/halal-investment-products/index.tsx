import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getHalalInvestmentProducts, deleteHalalInvestmentProductById } from 'apiSdk/halal-investment-products';
import { HalalInvestmentProductInterface } from 'interfaces/halal-investment-product';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function HalalInvestmentProductListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<HalalInvestmentProductInterface[]>(
    () => '/halal-investment-products',
    () =>
      getHalalInvestmentProducts({
        relations: [, 'investment.count'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteHalalInvestmentProductById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Halal Investment Product
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('halal_investment_product', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/halal-investment-products/create`}>
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
                  <Th>name</Th>
                  <Th>description</Th>
                  <Th>performance</Th>

                  {hasAccess('investment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>investment</Th>}
                  {hasAccess('halal_investment_product', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                    <Th>Edit</Th>
                  )}
                  {hasAccess('halal_investment_product', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>View</Th>
                  )}
                  {hasAccess('halal_investment_product', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.id}</Td>
                    <Td>{record.name}</Td>
                    <Td>{record.description}</Td>
                    <Td>{record.performance}</Td>

                    {hasAccess('investment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.investment}</Td>
                    )}
                    {hasAccess('halal_investment_product', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/halal-investment-products/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('halal_investment_product', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/halal-investment-products/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('halal_investment_product', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'halal_investment_product',
  operation: AccessOperationEnum.READ,
})(HalalInvestmentProductListPage);

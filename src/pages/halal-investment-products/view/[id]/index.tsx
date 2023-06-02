import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getHalalInvestmentProductById } from 'apiSdk/halal-investment-products';
import { Error } from 'components/error';
import { HalalInvestmentProductInterface } from 'interfaces/halal-investment-product';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteInvestmentById } from 'apiSdk/investments';

function HalalInvestmentProductViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<HalalInvestmentProductInterface>(
    () => (id ? `/halal-investment-products/${id}` : null),
    () =>
      getHalalInvestmentProductById(id, {
        relations: [, 'investment'],
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
        Halal Investment Product Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              name: {data?.name}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              description: {data?.description}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              performance: {data?.performance}
            </Text>

            {hasAccess('investment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Investment
                </Text>
                <Link href={`/investments/create?halal_investment_product_id=${data?.id}`}>
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
  entity: 'halal_investment_product',
  operation: AccessOperationEnum.READ,
})(HalalInvestmentProductViewPage);

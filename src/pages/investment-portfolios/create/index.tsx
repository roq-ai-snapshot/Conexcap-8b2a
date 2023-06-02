import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createInvestmentPortfolio } from 'apiSdk/investment-portfolios';
import { Error } from 'components/error';
import { investmentPortfolioValidationSchema } from 'validationSchema/investment-portfolios';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getHalalInvestmentProducts } from 'apiSdk/halal-investment-products';
import { HalalInvestmentProductInterface } from 'interfaces/halal-investment-product';
import { getUsers } from 'apiSdk/users';
import { InvestmentPortfolioInterface } from 'interfaces/investment-portfolio';

function InvestmentPortfolioCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: InvestmentPortfolioInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createInvestmentPortfolio(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<InvestmentPortfolioInterface>({
    initialValues: {
      user_id: (router.query.user_id as string) ?? null,
      investment: [],
    },
    validationSchema: investmentPortfolioValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Investment Portfolio
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'user_id'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'investment_portfolio',
  operation: AccessOperationEnum.CREATE,
})(InvestmentPortfolioCreatePage);

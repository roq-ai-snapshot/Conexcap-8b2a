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
import { createInvestment } from 'apiSdk/investments';
import { Error } from 'components/error';
import { investmentValidationSchema } from 'validationSchema/investments';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { InvestmentPortfolioInterface } from 'interfaces/investment-portfolio';
import { HalalInvestmentProductInterface } from 'interfaces/halal-investment-product';
import { getInvestmentPortfolios } from 'apiSdk/investment-portfolios';
import { getHalalInvestmentProducts } from 'apiSdk/halal-investment-products';
import { InvestmentInterface } from 'interfaces/investment';

function InvestmentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: InvestmentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createInvestment(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<InvestmentInterface>({
    initialValues: {
      amount: 0,
      investment_portfolio_id: (router.query.investment_portfolio_id as string) ?? null,
      halal_investment_product_id: (router.query.halal_investment_product_id as string) ?? null,
    },
    validationSchema: investmentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Investment
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="amount" mb="4" isInvalid={!!formik.errors?.amount}>
            <FormLabel>amount</FormLabel>
            <NumberInput
              name="amount"
              value={formik.values?.amount}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors?.amount && <FormErrorMessage>{formik.errors?.amount}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<InvestmentPortfolioInterface>
            formik={formik}
            name={'investment_portfolio_id'}
            label={'investment_portfolio_id'}
            placeholder={'Select Investment Portfolio'}
            fetcher={getInvestmentPortfolios}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <AsyncSelect<HalalInvestmentProductInterface>
            formik={formik}
            name={'halal_investment_product_id'}
            label={'halal_investment_product_id'}
            placeholder={'Select Halal Investment Product'}
            fetcher={getHalalInvestmentProducts}
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
  entity: 'investment',
  operation: AccessOperationEnum.CREATE,
})(InvestmentCreatePage);

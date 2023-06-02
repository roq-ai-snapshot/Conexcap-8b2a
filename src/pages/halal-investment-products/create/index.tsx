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
import { createHalalInvestmentProduct } from 'apiSdk/halal-investment-products';
import { Error } from 'components/error';
import { halalInvestmentProductValidationSchema } from 'validationSchema/halal-investment-products';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { getInvestmentPortfolios } from 'apiSdk/investment-portfolios';
import { InvestmentPortfolioInterface } from 'interfaces/investment-portfolio';
import { HalalInvestmentProductInterface } from 'interfaces/halal-investment-product';

function HalalInvestmentProductCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: HalalInvestmentProductInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createHalalInvestmentProduct(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<HalalInvestmentProductInterface>({
    initialValues: {
      name: '',
      description: '',
      performance: 0,
      investment: [],
    },
    validationSchema: halalInvestmentProductValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Halal Investment Product
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
          <FormControl id="performance" mb="4" isInvalid={!!formik.errors?.performance}>
            <FormLabel>performance</FormLabel>
            <NumberInput
              name="performance"
              value={formik.values?.performance}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('performance', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors?.performance && <FormErrorMessage>{formik.errors?.performance}</FormErrorMessage>}
          </FormControl>

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
  entity: 'halal_investment_product',
  operation: AccessOperationEnum.CREATE,
})(HalalInvestmentProductCreatePage);

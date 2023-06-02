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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getEducationalResourceById, updateEducationalResourceById } from 'apiSdk/educational-resources';
import { Error } from 'components/error';
import { educationalResourceValidationSchema } from 'validationSchema/educational-resources';
import { EducationalResourceInterface } from 'interfaces/educational-resource';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function EducationalResourceEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EducationalResourceInterface>(
    () => (id ? `/educational-resources/${id}` : null),
    () => getEducationalResourceById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EducationalResourceInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEducationalResourceById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EducationalResourceInterface>({
    initialValues: data,
    validationSchema: educationalResourceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Educational Resource
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="title" mb="4" isInvalid={!!formik.errors?.title}>
              <FormLabel>title</FormLabel>
              <Input type="text" name="title" value={formik.values?.title} onChange={formik.handleChange} />
              {formik.errors.title && <FormErrorMessage>{formik.errors?.title}</FormErrorMessage>}
            </FormControl>
            <FormControl id="content" mb="4" isInvalid={!!formik.errors?.content}>
              <FormLabel>content</FormLabel>
              <Input type="text" name="content" value={formik.values?.content} onChange={formik.handleChange} />
              {formik.errors.content && <FormErrorMessage>{formik.errors?.content}</FormErrorMessage>}
            </FormControl>
            <FormControl id="category" mb="4" isInvalid={!!formik.errors?.category}>
              <FormLabel>category</FormLabel>
              <Input type="text" name="category" value={formik.values?.category} onChange={formik.handleChange} />
              {formik.errors.category && <FormErrorMessage>{formik.errors?.category}</FormErrorMessage>}
            </FormControl>

            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'educational_resource',
  operation: AccessOperationEnum.UPDATE,
})(EducationalResourceEditPage);

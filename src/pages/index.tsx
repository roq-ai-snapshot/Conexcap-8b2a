import { Button, Flex, Heading, Image, Text, Stack, useBreakpointValue } from '@chakra-ui/react';

import { signIn, signUp, requireNextAuth } from '@roq/nextjs';

import Head from 'next/head';

function HomePage() {
  return (
    <>
      <Head>
        <title>Conexcap</title>

        <meta
          name="description"
          content="Empower Your Financial Journey with Conexcap: A Halal Investment Application Tailored to Muslim Ethics, Personal Finance Management, Wealth Growth, and Financial Education."
        />
      </Head>

      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Stack spacing={6} w={'full'} maxW={'lg'}>
            <Image src="/roq.svg" alt="Logo" w="150px" mb="8" />
            <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
              <Text as={'span'}>Explore the</Text>{' '}
              <Text
                as={'span'}
                position={'relative'}
                _after={{
                  content: "''",
                  width: 'full',
                  height: useBreakpointValue({ base: '20%', md: '30%' }),
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: 'cyan.400',
                  zIndex: -1,
                }}
              >
                Conexcap
              </Text>
            </Heading>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              Empower Your Financial Journey with Conexcap: A Halal Investment Application Tailored to Muslim Ethics,
              Personal Finance Management, Wealth Growth, and Financial Education.
            </Text>
            <Text>InvestmentAppOwnerInvestmentAppOwner</Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Button
                rounded={'full'}
                bg={'cyan.500'}
                color={'white'}
                _hover={{
                  bg: 'cyan.700',
                }}
                onClick={() => signUp('investmentappownerinvestmentappowner')}
              >
                Signup
              </Button>
              <Button rounded={'full'} onClick={() => signIn('investmentappownerinvestmentappowner')}>
                Login
              </Button>
            </Stack>
            ,<Text>IndividualInvestor</Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Button
                rounded={'full'}
                bg={'cyan.500'}
                color={'white'}
                _hover={{
                  bg: 'cyan.700',
                }}
                onClick={() => signUp('individualinvestor')}
              >
                Signup
              </Button>
              <Button rounded={'full'} onClick={() => signIn('individualinvestor')}>
                Login
              </Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image alt={'Login Image'} objectFit={'cover'} src={'/homebg.jpg'} />
        </Flex>
      </Stack>
    </>
  );
}

export default requireNextAuth({
  redirectIfAuthenticated: true,
  redirectTo: '/users',
})(HomePage);

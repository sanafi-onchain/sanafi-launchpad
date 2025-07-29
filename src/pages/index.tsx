import Explore from '@/components/Explore';
import Page from '@/components/ui/Page/Page';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';

export default function Index({ isLogin }) {
  return (
    <>
      <Head>
        <title>Ethics - Ethical Project Launchpad | Build Responsible Technology</title>
      </Head>
      <Page isLogin={isLogin}>
        <Explore />
      </Page>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  // read cookies
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies['sana_auth'] || '';

  return {
    props: {
      isLogin: !!token,
    },
  };
};

import Explore from '@/components/Explore';
import Page from '@/components/ui/Page/Page';
import Head from 'next/head';

export default function Index() {
  return (
    <>
      <Head>
        <title>Ethics - Ethical Project Launchpad | Build Responsible Technology</title>
      </Head>
      <Page>
        <Explore />
      </Page>
    </>
  );
}

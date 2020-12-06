import Head from 'next/head';

interface Props {
  title: string;
}

export default ({ title }: Props) => (
  <Head>
    <title>{title}</title>
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

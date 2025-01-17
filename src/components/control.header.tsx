import Head from 'next/head';

interface Props {
  title: string;
}

const ControlHeader = ({ title }: Props) => (
  <Head>
    <title>{title}</title>
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

export default ControlHeader;

import { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default ({ title, subtitle, children }: Props) => (
  <main className="mb-16">
    <h1 className="text-center text-5xl leading-tight">{title}</h1>
    <p className="text-center text-3xl mt-6">{subtitle}</p>

    <div className="pt-8 pr-2 pl-2">{children}</div>
  </main>
);

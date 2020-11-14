import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default ({ children }: Props) => (
  <div className="flex justify-center items-center min-h-screen p-2 bg-beige text-gray-700 flex-col font-serif">
    {children}
  </div>
);

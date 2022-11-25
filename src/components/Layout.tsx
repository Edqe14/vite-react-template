import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export interface Props {
  children?: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <main className="w-screen h-screen flex flex-col">
      <Topbar />

      <section className="relative flex-grow flex overflow-auto">
        <Sidebar />

        <section className="relative flex-grow p-6 flex flex-col overflow-auto">
          {children}
        </section>
      </section>
    </main>
  );
}
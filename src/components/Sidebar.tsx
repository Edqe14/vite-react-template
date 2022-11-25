import { Avatar, Button, List, ThemeIcon } from '@mantine/core';
import { IconBook, IconCalendarEvent, IconChevronLeft, IconChevronRight, IconDashboard, IconFileImport, IconPray, IconUserCircle } from '@tabler/icons';
import { NavLink } from 'react-router-dom';
import shallow from 'zustand/shallow';
import { useState } from 'react';
import { useClickOutside } from '@mantine/hooks';
import getNameInitial from '@/lib/helpers/getNameInitial';
import useUser from '@/lib/store/user';

export default function Sidebar() {
  const [name, clear] = useUser((state) => [state.name, state.clear], shallow);
  const [show, setShow] = useState(false);
  const ref = useClickOutside(() => setShow(false));

  const activeClassName = 'font-semibold';
  const logout = () => {
    localStorage.removeItem('token');
    clear();
  };

  return (
    <aside className={`max-w-xs absolute ${show ? 'translate-x-0' : '-translate-x-full'} drop-shadow-sm md:drop-shadow-none md:translate-x-0 transition-transform duration-200 ease-in-out top-0 left-0 bg-white h-full z-50 md:relative w-full border-r flex flex-col justify-between`}>
      <span ref={ref} onClick={() => setShow(!show)} className="absolute visible md:hidden right-0 translate-x-full top-1/2 -translate-y-1/2 py-2 pr-2 pl-1 bg-red-500 text-white rounded-tr-full rounded-br-full cursor-pointer">
        {!show && (<IconChevronRight size={25} />)}
        {show && (<IconChevronLeft size={25} />)}
      </span>

      <section className="p-6">
        <List
          classNames={{
            itemWrapper: 'text-lg items-center text-gray-700',
            root: 'gap-1 flex flex-col'
          }}
        >
          <NavLink to="/" className={({ isActive }) => isActive ? activeClassName : ''}>
            <List.Item icon={<ThemeIcon radius="xl" variant="light" color="blue" size={32}><IconDashboard size={24} /></ThemeIcon>}>Dashboard</List.Item>
          </NavLink>

          <NavLink to="/users" className={({ isActive }) => isActive ? activeClassName : ''}>
            <List.Item icon={<ThemeIcon radius="xl" variant="light" color="violet" size={32}><IconUserCircle size={24} /></ThemeIcon>}>Users</List.Item>
          </NavLink>

          <NavLink to="/requests" className={({ isActive }) => isActive ? activeClassName : ''}>
            <List.Item icon={<ThemeIcon radius="xl" variant="light" color="green" size={32}><IconFileImport size={24} /></ThemeIcon>}>Permintaan</List.Item>
          </NavLink>

          <NavLink to="/worships" className={({ isActive }) => isActive ? activeClassName : ''}>
            <List.Item icon={<ThemeIcon radius="xl" variant="light" color="yellow" size={32}><IconPray size={24} /></ThemeIcon>}>Ibadah</List.Item>
          </NavLink>

          <NavLink to="/articles" className={({ isActive }) => isActive ? activeClassName : ''}>
            <List.Item icon={<ThemeIcon radius="xl" variant="light" color="grape" size={32}><IconBook size={24} /></ThemeIcon>}>Publikasi</List.Item>
          </NavLink>

          <NavLink to="/events" className={({ isActive }) => isActive ? activeClassName : ''}>
            <List.Item icon={<ThemeIcon radius="xl" variant="light" color="pink" size={32}><IconCalendarEvent size={24} /></ThemeIcon>}>Acara</List.Item>
          </NavLink>
        </List>
      </section>

      <section className="p-6 border-t flex justify-between items-center">
        <section className="flex gap-4 items-center">
          <Avatar color="cyan" radius="xl" size={42}>{getNameInitial(name as string)}</Avatar>

          <section>
            <h2 className="text-lg font-medium text-gray-700">{name}</h2>
          </section>
        </section>

        <Button color="red" onClick={logout}>Logout</Button>
      </section>
    </aside>
  );
}
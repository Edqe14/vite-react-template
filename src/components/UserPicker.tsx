import { Select, SelectProps } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import useSWR from 'swr';
import { useEffect, useMemo, useState } from 'react';
import fetcher from '@/lib/fetcher';
import { Response, User } from '@/lib/types';

interface Props extends Omit<SelectProps, 'data'> {
  additionalData?: Omit<User, 'profile'>[];
  ignoreIds?: number[];
}

export default function UserPicker({ additionalData, ignoreIds = [], ...props }: Props) {
  const [search, setSearch] = useDebouncedState('', 200);
  const { data } = useSWR<Response<Omit<User, 'profile'>[]>>(`/users?q=${search}`, {
    revalidateOnFocus: false,
    refreshWhenOffline: false,
  });
  const [initialUser, setInitialValue] = useState<Omit<User, 'profile'>[]>([]);

  const usableData = useMemo<Omit<User, 'profile'>[]>(
    () =>
      [
        ...initialUser,
        ...(additionalData ?? []),
        ...(data?.data ?? []),
      ].filter((v, i, self) => self.findIndex((l) => v.id === l.id) === i),
    [additionalData, data, initialUser, ignoreIds]
  );

  useEffect(() => {
    (async () => {
      if (!props.value) return;

      // eslint-disable-next-line no-restricted-globals, @typescript-eslint/no-explicit-any
      if (props.value && isNaN(props.value as any) && typeof props.value !== 'object' && !usableData.some((v) => v.name === props.value)) {
        return setInitialValue([
          {
            name: props.value,
            id: props.value as unknown as number,
            email: 'temp',
            is_admin: false,
            created_at: '',
            updated_at: '',
          }
        ]);
      }

      // eslint-disable-next-line no-restricted-globals
      if (props.value && !isNaN(props.value as unknown as number) && !usableData.some((d) => d.id === parseInt(props.value as string, 10)) && !initialUser.some((d) => d.id === (props.value as unknown as number)) && !ignoreIds?.includes(props.value as unknown as number)) {
        try {
          const res = await fetcher<Response<User>>(`/users/${props.value}`);

          setInitialValue([res.data.data]);
        // eslint-disable-next-line no-empty
        } catch {}
      }
    })();
  }, [props.value]);

  return (
    <Select
      {...props}
      searchable
      clearable
      nothingFound="No users found"
      data={usableData.map((u) => ({
        label: u.name,
        value: u?.id as unknown as string ?? u.name,
        disabled: ignoreIds?.includes(u.id),
      }))}
      onSearchChange={setSearch}
      className="mb-4"
      classNames={{ input: 'text-lg mt-1' }}
      getCreateLabel={(query) => `+ ${query}`}
      onCreate={(query) => {
        const item: Omit<User, 'profile'> = {
          name: query,
          id: query as unknown as number,
          email: 'temp',
          is_admin: false,
          created_at: '',
          updated_at: '',
        };

        setInitialValue((current) => [...current, item]);

        return {
          label: query,
          value: query
        };
      }}
    />
  );
}
import { Group, Image, Input, InputWrapperBaseProps } from '@mantine/core';
import { Dropzone, DropzoneProps } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { IconDownload, IconFile, IconPhoto, IconX } from '@tabler/icons';
import { pick } from 'lodash-es';
import { useEffect, useState } from 'react';
import formatBytes from '@/lib/helpers/formatBytes';

interface Props extends Omit<DropzoneProps, 'children' | 'onChange' | 'onDrop'>, InputWrapperBaseProps {
  value: File | string | null;
  appendBaseUrl?: boolean;
  onChange: (val: File | string | null) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const IMAGE_FORMATS = ['jpg', 'png', 'jpeg', 'gif', 'svg'];
const FILE_MAX_SIZE = 3 * 1024 ** 2; // in bytes

export default function FileDropzone({ appendBaseUrl = true, onChange = noop, ...props }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!props.value || !IMAGE_FORMATS.includes(props.value instanceof File ? props.value.name?.split('.')?.pop()?.toLowerCase() as string : props.value.split('?')[0]?.split('.')?.pop()?.toLowerCase() as string)) return setPreviewUrl(null);

    const url = typeof props.value !== 'string' ? URL.createObjectURL(props.value as File) : `${appendBaseUrl ? `${import.meta.env.VITE_STORE_URL}/` : ''}${props.value}`;
    setPreviewUrl(url);

    return () => {
      if (typeof props.value !== 'string') URL.revokeObjectURL(url);
    };
  }, [props.value]);

  return (
    <Input.Wrapper {...pick(props, ['label', 'description', 'error', 'required', 'withAsterisk', 'labelProps', 'descriptionProps', 'errorProps', 'inputContainer', 'inputWrapperOrder'])}>
      <section className="relative">
        {props.value && (
          <IconX className="absolute top-4 right-4 z-10 cursor-pointer" onClick={() => onChange(null)} />
        )}

        <Dropzone
          onDrop={([file]) => onChange(file)}
          onReject={([rejection]) => showNotification({ message: rejection.errors[0].code === 'file-too-large' ? 'File terlalu besar' : rejection.errors[0].message, color: 'red' })}
          className="relative"
          maxSize={FILE_MAX_SIZE}
          {...props}
        >
          <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
            {!props.value && (
              <>
                <Dropzone.Reject>
                  <IconX
                    size={56}
                    stroke={1.2}
                    className="text-red-500"
                  />
                </Dropzone.Reject>

                <Dropzone.Accept>
                  <IconDownload
                    size={56}
                    stroke={1.2}
                    className="text-blue-500"
                  />
                </Dropzone.Accept>

                <Dropzone.Idle>
                  <IconPhoto size={56} stroke={1.2} className="text-orange-400" />
                </Dropzone.Idle>

                <section className="text-gray-600">
                  <p>
                    Tarik file ke sini atau klik untuk memilih file
                  </p>

                  {(props.maxSize === undefined && FILE_MAX_SIZE) && <p>
                    File harus lebih kecil dari {formatBytes(props.maxSize ?? FILE_MAX_SIZE)}
                  </p>}
                </section>
              </>
            )}

            {props.value && (
              <Image height="35vh" fit="contain" src={previewUrl} withPlaceholder={!previewUrl} placeholder={
                <section className="flex flex-col items-center border border-gray-300 shadow-md py-20 px-8 rounded-xl">
                  <IconFile size={64} className="mb-4 text-violet-500" opacity={0.75} stroke={1.2} />

                  <h3 className="text-gray-600 text-center">{props.value instanceof File ? props.value.name : props.value}</h3>
                </section>
              } />
            )}
          </Group>
        </Dropzone>
      </section>
    </Input.Wrapper>
  );
}
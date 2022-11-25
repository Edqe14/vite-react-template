import { LoadingOverlay, LoadingOverlayProps } from '@mantine/core';

export default function Loading(props: LoadingOverlayProps) {
  return (
    <LoadingOverlay transitionDuration={200} loaderProps={{ color: 'orange' }} {...props} />
  );
}
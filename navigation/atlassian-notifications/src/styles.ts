export const iframeCSS = ({ loading }: { loading: boolean }) =>
  ({
    border: 0,
    flex: '1 0 100%',
    height: 'inherit',
    display: loading ? 'none' : 'block',
    width: '100%',
  } as const);

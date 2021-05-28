export default ({ src, loading, loaded, errored }: any) => {
  switch (src) {
    case 'src-loading':
      return loading;
    case 'src-error':
      return errored;
    case 'src-loaded':
    default:
      return loaded;
  }
};

export default (): Document | undefined => {
  if (typeof window === 'undefined') {
    return;
  }
  if (typeof window.document === 'undefined') {
    return;
  }
  return window.document;
};

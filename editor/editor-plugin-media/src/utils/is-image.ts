export const isImage = (fileType?: string): boolean => {
  return (
    !!fileType &&
    (fileType.indexOf('image/') > -1 || fileType.indexOf('video/') > -1)
  );
};

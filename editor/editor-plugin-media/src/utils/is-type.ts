export const isImage = (type?: string): boolean => {
  return (
    !!type &&
    (type.indexOf('image/') > -1 ||
      type.indexOf('video/') > -1 ||
      type === 'image')
  );
};

export const isVideo = (fileType?: string): boolean => {
  return !!fileType && fileType.includes('video/');
};

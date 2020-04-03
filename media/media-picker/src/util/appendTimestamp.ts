const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const appendTimestamp = (fileName: string, timestamp: number) => {
  const dotPosition = fileName.lastIndexOf('.');
  const containsDot = dotPosition > 0;
  const fileNameWithoutExtension = containsDot
    ? fileName.substring(0, dotPosition)
    : fileName;
  const extension = containsDot ? fileName.substring(dotPosition) : '';
  const date = new Date(timestamp);

  const formattedDate = `${date.getUTCFullYear()}${padZero(
    date.getUTCMonth() + 1,
  )}${padZero(date.getUTCDate())}`;
  const formattedTime = `${padZero(date.getUTCHours())}${padZero(
    date.getUTCMinutes(),
  )}${padZero(date.getUTCSeconds())}`;

  return `${fileNameWithoutExtension}-${formattedDate}-${formattedTime}${extension}`;
};

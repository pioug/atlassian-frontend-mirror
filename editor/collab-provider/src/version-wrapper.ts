export const name = process.env._PACKAGE_NAME_ as string;
export const version = process.env._PACKAGE_VERSION_ as string;
export const nextMajorVersion = () => {
  return [Number(version.split('.')[0]) + 1, 0, 0].join('.');
};

const ufoprefix = '[ufo🛸]';

export const ufolog = (...args: Array<any>) => {
  // eslint-disable-next-line no-console
  console.log(ufoprefix, ...args);
};

export const ufowarn = (...args: Array<any>) => {
  // eslint-disable-next-line no-console
  console.warn(ufoprefix, ...args);
};

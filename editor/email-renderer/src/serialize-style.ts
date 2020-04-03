import { Style } from './interfaces';

export const serializeStyle = (style: Style): string => {
  return Object.keys(style).reduce((memo, key) => {
    if (style[key] === undefined) {
      return memo;
    }

    const value = String(style[key]).replace(/"/g, "'");
    return (memo += `${key}: ${value};`);
  }, '');
};

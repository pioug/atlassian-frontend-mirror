import { replaceRaf } from 'raf-stub';

export const replace = () => {
  replaceRaf();
};

export const step = () => {
  (window.requestAnimationFrame as any).step();
};

export const flush = () => {
  (window.requestAnimationFrame as any).flush();
};

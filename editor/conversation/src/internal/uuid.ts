/* eslint-disable no-bitwise */
export const generateUuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
/* eslint-enable no-bitwise */

let staticValue: string | boolean = false;

export const uuid = {
  setStatic(value: string | boolean) {
    staticValue = value;
  },

  generate() {
    return staticValue || generateUuid();
  },
};

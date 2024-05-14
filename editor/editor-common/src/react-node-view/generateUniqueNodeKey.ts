import uuid from 'uuid/v4';

export const generateUniqueNodeKey = () => {
  return uuid();
};

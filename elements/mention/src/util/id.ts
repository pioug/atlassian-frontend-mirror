import uuid from 'uuid';

export default (prefix: string = ''): string => `${prefix}_${uuid()}`;

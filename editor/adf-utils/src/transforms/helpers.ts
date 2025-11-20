import { type ADFEntity } from '../types';

export const isEmpty = (node: ADFEntity): boolean => !node?.content?.length;

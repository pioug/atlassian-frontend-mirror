import { type ADFEntity } from '../types';

export const isEmpty = (node: ADFEntity) => !node?.content?.length;

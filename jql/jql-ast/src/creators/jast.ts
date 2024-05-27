import { type JQLParseError } from '../errors';
import { type Jast, type Query } from '../types';

export const jast = (
  query: Query | void,
  represents: string = '',
  errors: JQLParseError[] = [],
): Jast => ({
  query,
  represents,
  errors,
});

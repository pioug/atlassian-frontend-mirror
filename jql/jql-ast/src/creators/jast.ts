import { JQLParseError } from '../errors';
import { Jast, Query } from '../types';

export const jast = (
  query: Query | void,
  represents: string = '',
  errors: JQLParseError[] = [],
): Jast => ({
  query,
  represents,
  errors,
});

import { Jast, JastBuilder } from '@atlaskit/jql-ast';

export const isValidJql = (jql: string): boolean => {
  const jast: Jast = new JastBuilder().build(jql);
  return jast?.errors?.length === 0;
};

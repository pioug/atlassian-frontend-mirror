import { DocNode } from './validator/entry';

// https://product-fabric.atlassian.net/wiki/spaces/ADF/pages/881362244/ADF+Change+42+Uniform+Empty+ADF+Representation
export const getEmptyADF = (): DocNode => ({
  type: 'doc',
  version: 1,
  content: [],
});

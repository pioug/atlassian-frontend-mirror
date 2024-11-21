// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import { type DocNode } from '@atlaskit/adf-schema';

// https://product-fabric.atlassian.net/wiki/spaces/ADF/pages/881362244/ADF+Change+42+Uniform+Empty+ADF+Representation
export const getEmptyADF = (): DocNode => ({
	type: 'doc',
	version: 1,
	content: [],
});

export { isEmpty } from './transforms/helpers';

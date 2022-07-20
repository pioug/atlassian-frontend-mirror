import { createTransformer } from '@atlaskit/codemod-utils';

import { validatorExports, validatorTypes } from './migrates/entry-points';

const transformer = createTransformer([...validatorTypes, ...validatorExports]);

export default transformer;

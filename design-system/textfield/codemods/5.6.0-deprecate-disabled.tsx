import { createTransformer } from '@atlaskit/codemod-utils';

import { renameDisabledToIsDisabled } from './migrations/rename-disabled-to-isdisabled';

const transformer = createTransformer([renameDisabledToIsDisabled]);

export default transformer;

import { removeSize } from './migrations/remove-props';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/checkbox', [removeSize]);

export default transformer;

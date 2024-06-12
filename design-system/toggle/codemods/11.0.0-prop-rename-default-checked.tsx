import { renameDefaultChecked } from './migrates/rename-is-default-checked-to-default-checked';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/toggle', [renameDefaultChecked]);

export default transformer;

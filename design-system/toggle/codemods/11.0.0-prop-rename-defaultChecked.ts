import { renameDefaultChecked } from './migrates/rename-isDefaultChecked-to-defaultChecked';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/toggle', [
  renameDefaultChecked,
]);

export default transformer;

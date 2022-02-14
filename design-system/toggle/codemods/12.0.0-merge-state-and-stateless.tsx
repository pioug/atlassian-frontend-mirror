import { elevateStatelessToDefault } from './migrates/elevate-stateless-to-default';
import { renameToggleStatelessToToggle } from './migrates/rename-togglestateless-to-toggle';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/toggle', [
  elevateStatelessToDefault,
  renameToggleStatelessToToggle,
]);

export default transformer;

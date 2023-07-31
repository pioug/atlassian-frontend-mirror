import { createTransformer } from '@atlaskit/codemod-utils';

import {
  migrateImports as commandsImports,
  migrateTypes as commandsTypes,
} from './migrates/prosemirror-commands';
import {
  migrateImports as dropcursorImports,
  migrateTypes as dropcursorTypes,
} from './migrates/prosemirror-dropcursor';
import {
  migrateImports as historyImports,
  migrateTypes as historyTypes,
} from './migrates/prosemirror-history';
import {
  migrateImports as keymapImports,
  migrateTypes as keymapTypes,
} from './migrates/prosemirror-keymap';
import {
  migrateImports as markdownImports,
  migrateTypes as markdownTypes,
} from './migrates/prosemirror-markdown';
import {
  migrateImports as modelImports,
  migrateTypes as modelTypes,
} from './migrates/prosemirror-model';
import {
  migrateImports as stateImports,
  migrateTypes as stateTypes,
} from './migrates/prosemirror-state';
import {
  migrateImports as transformImports,
  migrateTypes as transformTypes,
} from './migrates/prosemirror-transform';
import {
  migrateImports as utilsImports,
  migrateTypes as utilsTypes,
} from './migrates/prosemirror-utils';
import {
  migrateImports as viewImports,
  migrateTypes as viewTypes,
} from './migrates/prosemirror-view';

const transforms = [
  ...viewImports,
  ...viewTypes,
  ...utilsImports,
  ...utilsTypes,
  ...transformImports,
  ...transformTypes,
  ...stateImports,
  ...stateTypes,
  ...modelImports,
  ...modelTypes,
  ...markdownImports,
  ...markdownTypes,
  ...keymapImports,
  ...keymapTypes,
  ...historyImports,
  ...historyTypes,
  ...dropcursorImports,
  ...dropcursorTypes,
  ...commandsImports,
  ...commandsTypes,
];
const transformer = createTransformer(transforms);

export default transformer;

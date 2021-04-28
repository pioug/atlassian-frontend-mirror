import { JSCodeshift } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  createTransformer,
  hasImportDeclaration,
} from '@atlaskit/codemod-utils';

import { addIdProp } from './migrations/add-id-prop';
import { mapTabsProp, removeTabsProp } from './migrations/map-tabs-prop';
import { migrateOnSelectType } from './migrations/onSelect-to-onChange';
import { removeComponentsProp } from './migrations/remove-components-prop';
import { removeIsSelectedTestProp } from './migrations/remove-isSelectedTest-prop';
import { removeTabItemTabContent } from './migrations/remove-TabItem-TabContent';
import { removeTypes } from './migrations/remove-types';
import { renameIsContentPersistedToShouldUnmountTabPanelOnChange } from './migrations/rename-isContentPersisted-to-shouldUnmountTabPanelOnChange';

const transformer = createTransformer(
  [
    // Note these first 2 must be done first while there is one JSX element for tabs
    addIdProp,
    renameIsContentPersistedToShouldUnmountTabPanelOnChange,
    migrateOnSelectType,
    removeTabItemTabContent,
    mapTabsProp,
    removeTabsProp,
    removeComponentsProp,
    removeIsSelectedTestProp,
    removeTypes,
  ],
  (j: JSCodeshift, source: Collection<Node>) =>
    hasImportDeclaration(j, source, '@atlaskit/tabs'),
);

export default transformer;

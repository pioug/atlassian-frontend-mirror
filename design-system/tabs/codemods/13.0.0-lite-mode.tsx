import { type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { createTransformer, hasImportDeclaration } from '@atlaskit/codemod-utils';

import { addIdProp } from './migrations/add-id-prop';
import { mapTabsProp, removeTabsProp } from './migrations/map-tabs-prop';
import { migrateOnSelectType } from './migrations/on-select-to-on-change';
import { removeComponentsProp } from './migrations/remove-components-prop';
import { removeIsSelectedTestProp } from './migrations/remove-is-selected-test-prop';
import { removeTabItemTabContent } from './migrations/remove-tab-item-tab-content';
import { removeTypes } from './migrations/remove-types';
import { renameIsContentPersistedToShouldUnmountTabPanelOnChange } from './migrations/rename-is-content-persisted-to-should-unmount-tab-panel-on-change';

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
	(j: JSCodeshift, source: Collection<Node>) => hasImportDeclaration(j, source, '@atlaskit/tabs'),
);

export default transformer;

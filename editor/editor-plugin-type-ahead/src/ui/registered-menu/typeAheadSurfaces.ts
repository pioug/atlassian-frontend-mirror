import type React from 'react';

import type { MessageDescriptor } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { MENU } from '@atlaskit/editor-common/quick-insert/keys';
import { TypeAheadAvailableNodes, typeAheadListMessages } from '@atlaskit/editor-common/type-ahead';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { TypeAheadQuickInsertItem } from './quick-insert/TypeAheadQuickInsertItem';
import { TypeAheadQuickInsertProvider } from './quick-insert/TypeAheadQuickInsertProvider';
import type { TypeAheadItemComponent } from './typeAheadMenuTypes';

export type TypeAheadSurface = {
	inputMethod: INPUT_METHOD.QUICK_INSERT;
	Item: TypeAheadItemComponent;
	listIdPrefix: string;
	listLabel: MessageDescriptor;
	Provider: React.ComponentType<React.PropsWithChildren>;
	root: {
		key: string;
		type: 'menu';
	};
};

const quickInsertSurface: TypeAheadSurface = {
	inputMethod: INPUT_METHOD.QUICK_INSERT,
	Item: TypeAheadQuickInsertItem,
	listIdPrefix: 'quick-insert-menu',
	listLabel: typeAheadListMessages.quickInsertInputLabel,
	Provider: TypeAheadQuickInsertProvider,
	root: MENU,
};

export const getTypeAheadSurface = (id?: TypeAheadAvailableNodes): TypeAheadSurface | undefined => {
	if (
		id === TypeAheadAvailableNodes.QUICK_INSERT &&
		isExperimentEnabled('platform_editor_slash_command')
	) {
		return quickInsertSurface;
	}

	return undefined;
};

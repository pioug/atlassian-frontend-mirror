import React from 'react';

import { useQuickInsertContext } from '@atlaskit/editor-common/quick-insert/use-quick-insert-context';
import type { RegisterMenuItem, SurfaceContext } from '@atlaskit/editor-ui-control-model/types';

type Props = Record<string, unknown> & {
	getSnapshot: (surfaceContext?: SurfaceContext) => RegisterMenuItem[];
	index: number;
};

export const QuickInsertRecommendedSlot = ({
	index,
	getSnapshot,
	...props
}: Props): React.ReactNode => {
	const { surfaceContext } = useQuickInsertContext();
	const item = getSnapshot(surfaceContext)[index];

	return item?.component ? React.createElement(item.component, props) : null;
};

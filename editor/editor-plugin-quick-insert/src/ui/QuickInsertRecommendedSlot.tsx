import React from 'react';

import { useQuickInsertContext } from '@atlaskit/editor-common/quick-insert/use-quick-insert-context';
import type {
	CommonComponentProps,
	RegisterMenuItem,
	SurfaceContext,
} from '@atlaskit/editor-ui-control-model/types';

type Props = CommonComponentProps & {
	getSnapshot: (surfaceContext?: SurfaceContext) => RegisterMenuItem[];
	index: number;
};

export const QuickInsertRecommendedSlot = ({
	children,
	parents,
	surfaceContext,
	index,
	getSnapshot,
}: Props): React.ReactNode => {
	const { surfaceContext: menuSurfaceContext } = useQuickInsertContext();
	const item = getSnapshot(menuSurfaceContext)[index];

	return item?.component ? (
		<item.component parents={parents} surfaceContext={surfaceContext}>
			{children}
		</item.component>
	) : null;
};

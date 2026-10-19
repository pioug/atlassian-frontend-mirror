import React from 'react';

import { cssMap } from '@atlaskit/css';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import type { TypeAheadItemComponent } from './typeAheadMenuTypes';

const styles = cssMap({
	footer: {
		borderTopColor: token('color.border'),
		borderTopStyle: 'solid',
		borderTopWidth: token('border.width'),
	},
});

export const TypeAheadMenuFooter = ({
	id,
	isSelected,
	Item,
	onMouseMove,
	registration,
	hasScrollPadding = false,
}: {
	hasScrollPadding?: boolean;
	id: string;
	isSelected: boolean;
	Item: TypeAheadItemComponent;
	onMouseMove: () => void;
	registration: RegisterMenuItem;
}): React.JSX.Element => (
	<Box
		onMouseMove={onMouseMove}
		paddingBlockEnd={hasScrollPadding ? 'space.075' : undefined}
		xcss={styles.footer}
	>
		<Item id={id} isSelected={isSelected} registration={registration} />
	</Box>
);

import React from 'react';

import { cssMap } from '@atlaskit/css';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { TypeAheadItemComponent } from './typeAheadMenuTypes';

const styles = cssMap({
	footer: {
		borderTopColor: token('color.border'),
		borderTopStyle: 'solid',
		borderTopWidth: token('border.width'),
		paddingBlock: token('space.050'),
	},
});

export const TypeAheadMenuFooter = ({
	id,
	isSelected,
	Item,
	onMouseMove,
	registration,
}: {
	id: string;
	isSelected: boolean;
	Item: TypeAheadItemComponent;
	onMouseMove: () => void;
	registration: RegisterMenuItem;
}): React.JSX.Element => (
	<Box onMouseMove={onMouseMove} xcss={styles.footer}>
		<Item id={id} isSelected={isSelected} registration={registration} />
	</Box>
);

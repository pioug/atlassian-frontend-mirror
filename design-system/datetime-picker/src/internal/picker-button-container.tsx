/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx, type StrictXCSSProp } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'flex',
		height: '100%',
		position: 'absolute',
		alignItems: 'center',
		insetBlockStart: token('space.0'),
		insetInlineEnd: token('space.0'),
	},
	withClearIndicator: {
		marginInlineEnd: token('space.400'),
	},
	withoutClearIndicator: {
		marginInlineEnd: token('space.050'),
	},
});

type PickerButtonContainerProps = {
	children: React.ReactNode;
	hasClearIndicator: boolean;
	xcss?: StrictXCSSProp<'flexBasis' | 'color' | 'transition', '&:hover'>;
};

export const PickerButtonContainer = ({
	children,
	hasClearIndicator,
	xcss,
}: PickerButtonContainerProps): React.JSX.Element => (
	<div
		css={[
			styles.container,
			hasClearIndicator ? styles.withClearIndicator : styles.withoutClearIndicator,
		]}
		className={xcss}
	>
		{children}
	</div>
);

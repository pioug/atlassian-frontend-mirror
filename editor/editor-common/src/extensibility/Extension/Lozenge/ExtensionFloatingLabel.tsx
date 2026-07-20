/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactElement } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const floatingLabelStyles = cssMap({
	base: {
		alignItems: 'center',
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.small', '3px'),
		boxShadow: 'none',
		display: 'flex',
		gap: token('space.050'),
		justifyContent: 'center',
		maxWidth: '140px',
		opacity: 1,
		paddingLeft: token('space.100'),
		paddingRight: token('space.100'),
		position: 'absolute',
		right: token('space.150'),
		top: '-10px',
		visibility: 'visible',
		zIndex: 2,
	},
	selected: {
		backgroundColor: token('color.background.selected'),
		paddingBottom: token('space.050'),
		paddingTop: token('space.050'),
		top: '-14px',
	},
});

type Props = {
	isSelected?: boolean;
	testId?: string;
	title: string;
};

export const ExtensionFloatingLabel = ({ isSelected, testId, title }: Props): ReactElement => (
	<div
		css={[floatingLabelStyles.base, isSelected && floatingLabelStyles.selected]}
		contentEditable={false}
		data-testid={testId}
	>
		<Text
			maxLines={1}
			size="small"
			color={isSelected ? 'color.text.selected' : 'color.text.subtle'}
		>
			{title}
		</Text>
	</div>
);

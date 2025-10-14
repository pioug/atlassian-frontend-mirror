/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { SyntheticEvent } from 'react';
import { useCallback, useState, type PropsWithChildren } from 'react';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

import { cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { Text } from '@atlaskit/primitives/compiled';

const wrapperStyles = cssMap({
	root: {
		borderRadius: token('radius.medium'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		boxSizing: 'border-box',
		borderWidth: token('border.width', '1px'),

		color: token('color.text.subtle'),
		marginBlockStart: token('space.250'),
		display: 'flex',
		flexDirection: 'column',
	},
});

const headingStyles = cssMap({
	root: {
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.medium'),
		cursor: 'pointer',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: token('space.050'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.pressed'),
		},
	},
	isOpen: {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
});

const detailsStyles = cssMap({
	root: {
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
	},
});

export function Disclosure(props: PropsWithChildren<{ heading: string; isOpen?: boolean }>) {
	const { children, heading, isOpen = false } = props;
	const [_isOpen, setIsOpen] = useState(isOpen);

	const handleToggle = useCallback(
		(event: SyntheticEvent<HTMLDetailsElement, ToggleEvent>) => {
			setIsOpen(event.nativeEvent.newState === 'open');
		},
		[setIsOpen],
	);

	return (
		<details css={wrapperStyles.root} onToggle={handleToggle} open={_isOpen}>
			<summary css={[headingStyles.root, _isOpen && headingStyles.isOpen]}>
				{_isOpen ? (
					<ChevronDownIcon label="" size="medium" spacing="spacious" />
				) : (
					<ChevronRightIcon label="" size="medium" spacing="spacious" />
				)}
				<Text weight="semibold">{heading}</Text>
			</summary>
			<div css={detailsStyles.root}>{children}</div>
		</details>
	);
}

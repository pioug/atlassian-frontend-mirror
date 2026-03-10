/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { SyntheticEvent } from 'react';
import { useCallback, useState, type PropsWithChildren } from 'react';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Focusable, Text } from '@atlaskit/primitives/compiled';

const wrapperStyles = cssMap({
	root: {
		borderRadius: token('radius.medium'),
		borderStyle: 'none',
		boxSizing: 'border-box',
		marginBlockStart: token('space.250'),
		display: 'flex',
		flexDirection: 'column',
	},
});

const headingStyles = cssMap({
	root: {
		boxSizing: 'border-box',
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width', '1px'),
		backgroundColor: token('color.background.neutral'),
		cursor: 'pointer',
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
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
		borderRadius: token('radius.medium'),
	},
	isOpen: {
		borderEndEndRadius: 0,
		borderEndStartRadius: 0,
	},
});

const detailsStyles = cssMap({
	root: {
		boxSizing: 'border-box',
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderBlockStartStyle: 'none',
		borderWidth: token('border.width', '1px'),
		borderEndEndRadius: token('radius.medium'),
		borderEndStartRadius: token('radius.medium'),
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
			<Focusable
				as="summary"
				xcss={cx(headingStyles.root, _isOpen && headingStyles.isOpen)}
				isInset
			>
				{_isOpen ? (
					<ChevronDownIcon label="" size="small" spacing="spacious" />
				) : (
					<ChevronRightIcon label="" size="small" spacing="spacious" />
				)}
				<Text weight="semibold">{heading}</Text>
			</Focusable>
			<div css={detailsStyles.root}>{children}</div>
		</details>
	);
}

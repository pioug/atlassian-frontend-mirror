/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useRef } from 'react';

import { jsx } from '@compiled/react';
import invariant from 'tiny-invariant';

import { cssMap, cx } from '@atlaskit/css';
import { Pressable, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const styles = cssMap({
	root: {
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		backgroundColor: token('elevation.surface'),
		textAlign: 'start',
		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
		},
		'&:active': {
			backgroundColor: token('elevation.surface.pressed'),
		},
	},
});

const smallStyles = cssMap({
	root: {
		width: '200px',
	},
});

const content = {
	first: 'Tooltip shown on this item as it is concatenated',
	second: 'No tooltip shown as this item is not being concatenated',
};

export default function Example() {
	const firstRef = useRef<HTMLElement | null>(null);
	const secondRef = useRef<HTMLElement | null>(null);

	return (
		<Stack space="space.100">
			<Tooltip
				content={content.first}
				// don't need a screen reader announcement as the
				// tooltip content is the same as the items content
				isScreenReaderAnnouncementDisabled
				canAppear={() => {
					const element = firstRef.current;
					invariant(element);
					// Only showing the tooltip for this item when
					// the element has been clamped.
					return element.scrollHeight > element.clientHeight;
				}}
			>
				{(props) => (
					<Pressable {...props} xcss={cx(styles.root, smallStyles.root)}>
						<Text ref={firstRef} maxLines={1}>
							{content.first}
						</Text>
					</Pressable>
				)}
			</Tooltip>
			<Tooltip
				content={content.second}
				// don't need a screen reader announcement as the
				// tooltip content is the same as the items content
				canAppear={() => {
					const element = secondRef.current;
					invariant(element);
					// Only showing the tooltip for this item when
					// the element has been clamped.
					return element.scrollHeight > element.clientHeight;
				}}
			>
				{(props) => (
					<Pressable {...props} xcss={styles.root}>
						<Text ref={secondRef} maxLines={1}>
							{content.second}
						</Text>
					</Pressable>
				)}
			</Tooltip>
		</Stack>
	);
}

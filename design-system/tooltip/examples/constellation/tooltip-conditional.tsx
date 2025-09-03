/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useRef } from 'react';

import { jsx } from '@compiled/react';
import invariant from 'tiny-invariant';

import { cssMap, cx } from '@atlaskit/css';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const styles = cssMap({
	root: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
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
					<Box {...props} xcss={cx(styles.root, smallStyles.root)}>
						<Text ref={firstRef} maxLines={1}>
							{content.first}
						</Text>
					</Box>
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
					<Box {...props} xcss={styles.root}>
						<Text ref={secondRef} maxLines={1}>
							{content.second}
						</Text>
					</Box>
				)}
			</Tooltip>
		</Stack>
	);
}

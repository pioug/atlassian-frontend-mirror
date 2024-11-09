/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { useRef } from 'react';

import { jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { Box, Stack, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Tooltip from '../../src';

const styles = xcss({
	padding: 'space.100',
	borderColor: 'color.border',
	borderRadius: token('border.radius'),
	borderStyle: 'solid',
	borderWidth: token('border.width'),
});

const smallStyles = xcss({
	width: '200px',
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
					<Box {...props} xcss={[styles, smallStyles]}>
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
					<Box {...props} xcss={styles}>
						<Text ref={secondRef} maxLines={1}>
							{content.second}
						</Text>
					</Box>
				)}
			</Tooltip>
		</Stack>
	);
}

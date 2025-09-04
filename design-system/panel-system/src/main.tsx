/**
 * @jsxRuntime classic
 * @jsx jsx
 * @experimental This component is in exploratory/alpha stage and may have breaking changes.
 * Do not use without discussion with the Design System Team.
 */

import { css } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import { Anchor, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { PanelSystemProps } from './types';

const styles = cssMap({
	container: {
		marginTop: token('space.200'),
		marginRight: token('space.200'),
		marginBottom: token('space.200'),
		marginLeft: token('space.200'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
});

// NOTE: You can still use raw `css` from `@compiled/react` if you need to.
// In this case, we use it because `borderRadius` doesn't match our interface.
const containerWithBorder = css({
	borderRadius: token('border.radius.100'),
	borderStyle: 'solid',
	borderWidth: token('border.width'),
});

export default function PanelSystem({ testId }: PanelSystemProps) {
	return (
		<div
			css={[
				// NOTE: While `<Box>` is preferred for consistency, if you need complexity
				// that doesn't align with the types, using a raw `<div>` is acceptable,
				// just use `@atlaskit/css` where available
				styles.container,
				containerWithBorder,
			]}
			data-testid={testId}
		>
			<Text as="p">
				Hello world! Usually you'll be using{' '}
				<Anchor href="https://atlassian.design/components">
					Atlassian Design System components
				</Anchor>{' '}
				and{' '}
				<Anchor href="https://atlassian.design/components/primitives">
					Atlassian Design System Primitives
				</Anchor>{' '}
				to build your UI.
			</Text>
			<Text as="p">
				In the rare case that you need a bespoke solution that you can't achieve Atlassian Design
				System, you can create a custom component.
			</Text>
		</div>
	);
}

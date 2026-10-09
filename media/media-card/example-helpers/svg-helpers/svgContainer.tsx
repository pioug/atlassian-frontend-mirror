/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

const containerStyles = xcss({
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- the rule does not yet recognise @atlaskit/primitives subpath entry points
	outlineColor: 'color.border.accent.orange',
	outlineStyle: 'solid',
	outlineWidth: 'border.width.selected',
	margin: 'auto',
	marginTop: 'space.100',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- the rule does not yet recognise @atlaskit/primitives subpath entry points
	backgroundColor: 'color.background.accent.green.subtler',
});

export const SvgContainer = ({
	children,
	width,
	height,
}: {
	children: React.ReactNode;
	width?: string;
	height?: string;
}): jsx.JSX.Element => {
	return (
		<Box xcss={containerStyles} style={{ width, height }}>
			{children}
		</Box>
	);
};

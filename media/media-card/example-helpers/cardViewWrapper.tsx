/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

type CardViewWrapperProps = {
	small?: boolean;
	displayInline?: boolean;
	children?: JSX.Element;
};

const displayInlineStyles = (displayInline?: boolean) => {
	return displayInline ? 'inline-block;' : '';
};

// Minimum supported dimensions
const smallStyles = xcss({
	width: '156px',
	height: '108px',
});

// Maximum supported dimensions
const largeStyles = xcss({
	width: '600px',
	height: '450px',
});

const cardWrapperStyles = ({ small, displayInline }: CardViewWrapperProps) =>
	xcss({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		display: displayInlineStyles(displayInline),
		marginBlock: 'space.200',
		marginInline: 'space.250',
	});

export const CardViewWrapper = (props: CardViewWrapperProps) => {
	if (props.small) {
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		return <Box xcss={[cardWrapperStyles(props), smallStyles]}>{props.children}</Box>;
	} else {
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		return <Box xcss={[cardWrapperStyles(props), largeStyles]}>{props.children}</Box>;
	}
};

import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { N50A } from '@atlaskit/theme/colors';

export interface MutableCardContainerProps {
	mutable: boolean;
}

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const filmstripContainerStyles = css({
	border: `1px dotted ${token('color.border', N50A)}`,
	marginTop: '10px',
	marginBottom: '10px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const filmstripWrapperStyles = css({
	border: `1px solid ${token('color.border', '#ccc')}`,
	width: '800px',
	marginBottom: token('space.250', '20px'),
});

// 0-editable styles
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const storyWrapperStyles = css({
	padding: '1em',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const separatorStyles = css({
	margin: '1em 0',
	border: `1px solid ${token('color.border', '#ccc')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const controlLabelStyles = css({
	display: 'block',
	marginTop: '1em',
	fontWeight: 'bold',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const flexStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

type BoxProps = {
	grow?: number;
};

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
export const editableBoxStyles = ({ grow }: BoxProps) => css`
	padding: ${token('space.050', '4px')};
	${grow ? `flex-grow: ${grow};` : ''}
`;

// 3-pure-component styles
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pureComponentBoxStyles = css({
	width: '250px',
	height: '100px',
	backgroundColor: token('color.background.accent.green.subtle', 'lightgreen'),
});

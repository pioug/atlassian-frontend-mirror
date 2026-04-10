import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

export interface MutableCardContainerProps {
	mutable: boolean;
}

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const filmstripContainerStyles: SerializedStyles = css({
	border: `${token('border.width', '1px')} dotted ${token('color.border')}`,
	marginTop: '10px',
	marginBottom: '10px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const filmstripWrapperStyles: SerializedStyles = css({
	border: `${token('border.width', '1px')} solid ${token('color.border')}`,
	width: '800px',
	marginBottom: token('space.250'),
});

// 0-editable styles
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const storyWrapperStyles: SerializedStyles = css({
	padding: '1em',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const separatorStyles: SerializedStyles = css({
	margin: '1em 0',
	border: `${token('border.width', '1px')} solid ${token('color.border')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const controlLabelStyles: SerializedStyles = css({
	display: 'block',
	marginTop: '1em',
	fontWeight: token('font.weight.bold'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const flexStyles: SerializedStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

type BoxProps = {
	grow?: number;
};

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
export const editableBoxStyles = ({ grow }: BoxProps): SerializedStyles => css`
	padding: ${token('space.050')};
	${grow ? `flex-grow: ${grow};` : ''}
`;

// 3-pure-component styles
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pureComponentBoxStyles: SerializedStyles = css({
	width: '250px',
	height: '100px',
	backgroundColor: token('color.background.accent.green.subtle'),
});

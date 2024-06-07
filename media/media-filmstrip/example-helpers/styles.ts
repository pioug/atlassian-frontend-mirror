import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { N50A } from '@atlaskit/theme/colors';

export interface MutableCardContainerProps {
	mutable: boolean;
}

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const filmstripContainerStyles = css({
	border: `1px dotted ${token('color.border', N50A)}`,
	marginTop: '10px',
	marginBottom: '10px',
});

export const filmstripWrapperStyles = css({
	border: `1px solid ${token('color.border', '#ccc')}`,
	width: '800px',
	marginBottom: token('space.250', '20px'),
});

// 0-editable styles
export const storyWrapperStyles = css({
	padding: '1em',
});

export const separatorStyles = css({
	margin: '1em 0',
	border: `1px solid ${token('color.border', '#ccc')}`,
});

export const controlLabelStyles = css({
	display: 'block',
	marginTop: '1em',
	fontWeight: 'bold',
});

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
export const pureComponentBoxStyles = css({
	width: '250px',
	height: '100px',
	backgroundColor: token('color.background.accent.green.subtle', 'lightgreen'),
});

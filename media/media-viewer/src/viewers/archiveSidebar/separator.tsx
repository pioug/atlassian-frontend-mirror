/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { token } from '@atlaskit/tokens';

const separatorStyles = css({
	borderRadius: token('radius.full'),
	height: '2px',
	marginTop: `${token('space.200')}`,
	marginRight: '0',
	marginBottom: `${token('space.200')}`,
	marginLeft: '0',
	backgroundColor: token('color.border'),

	flexShrink: 0,
});

export const Separator = (): JSX.Element => {
	return <div css={separatorStyles} />;
};

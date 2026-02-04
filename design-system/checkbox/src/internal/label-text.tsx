/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@atlaskit/css';

import { type LabelTextProps } from '../types';

const labelTextStyles = css({
	alignSelf: 'center',
	gridArea: '1 / 2 / 2 / 3',
});

export default function LabelText({ children }: LabelTextProps): JSX.Element {
	return <span css={labelTextStyles}>{children}</span>;
}

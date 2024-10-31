/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import __noop from '@atlaskit/ds-lib/noop';
import { token } from '@atlaskit/tokens';

import { type EllipsisItemProps } from '../types';

const noop = __noop;

const itemWrapperStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	maxWidth: '100%',
	height: `${24 / 14}em`,
	margin: token('space.0', '0px'),
	padding: token('space.0', '0px'),
	flexDirection: 'row',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:not(:last-child)::after': {
		width: token('space.100', '8px'),
		flexShrink: 0,
		content: '"/"',
		paddingBlock: token('space.025'),
		paddingInline: token('space.100'),
		textAlign: 'center',
	},
});

const staticItemStyles = css({
	font: token('font.body'),
	paddingBlock: token('space.025'),
});

const EllipsisItem = memo(({ label, onClick = noop, testId }: EllipsisItemProps) => (
	<li css={itemWrapperStyles}>
		<Button
			appearance="subtle-link"
			aria-label={label}
			css={staticItemStyles}
			onClick={onClick}
			spacing="none"
			testId={testId}
		>
			&hellip;
		</Button>
	</li>
));

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default EllipsisItem;

/** @jsx jsx */

import { memo } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import __noop from '@atlaskit/ds-lib/noop';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { type EllipsisItemProps } from '../types';

const height = (gridSize() * 3) / fontSize();
const noop = __noop;

const itemWrapperStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	maxWidth: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: `${height}em`,
	margin: token('space.0', '0px'),
	padding: token('space.0', '0px'),
	flexDirection: 'row',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: `${height}em`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:not(:last-child)::after': {
		width: token('space.100', '8px'),
		padding: `${token('space.0', '0px')} ${token('space.100', '8px')}`,
		flexShrink: 0,
		content: '"/"',
		textAlign: 'center',
	},
});

const EllipsisItem = memo((props: EllipsisItemProps) => {
	const { onClick = noop, testId, label } = props;

	return (
		<li css={itemWrapperStyles}>
			<Button
				appearance="subtle-link"
				spacing="none"
				testId={testId}
				onClick={onClick}
				aria-label={label}
			>
				&hellip;
			</Button>
		</li>
	);
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default EllipsisItem;

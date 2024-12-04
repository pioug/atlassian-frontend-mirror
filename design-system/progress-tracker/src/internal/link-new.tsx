import React, { type FC } from 'react';

import { cssMap } from '@atlaskit/css';
import { Anchor } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type Stage } from '../types';

const styles = cssMap({
	anchor: {
		textDecoration: 'none',
		color: token('color.text'),
		// @ts-expect-error - inherited font is needed here
		font: 'inherit',

		'&:hover': {
			textDecoration: 'underline',
			color: token('color.link'),
		},

		'&:active': {
			color: token('color.link.pressed'),
		},
	},
});

/**
 * __Progress tracker link__
 */
const Link: FC<Stage & { testId?: string }> = ({ href, onClick, label, testId }) => {
	return (
		<Anchor
			xcss={styles.anchor}
			// TODO: We should not be rendering empty hrefs on anchors. This should be plain text or a button/pressable if `onClick` is provided.
			href={href || ''}
			onClick={onClick}
			testId={testId}
		>
			{label}
		</Anchor>
	);
};

export default Link;

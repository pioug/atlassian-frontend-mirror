/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { DateLabelDropdownTrigger } from '@atlaskit/date-label';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapper: {
		display: 'flex',
		gap: token('space.100'),
		flexWrap: 'wrap',
		alignItems: 'center',
	},
});

export default function DateLabelDropdownTriggerSpacious(): React.JSX.Element {
	return (
		<div css={styles.wrapper}>
			<DateLabelDropdownTrigger label="29 Jul 2026" appearance="neutral" isSpacious />
			<DateLabelDropdownTrigger label="29 Jul 2026" appearance="warning" isSpacious />
			<DateLabelDropdownTrigger label="29 Jul 2026" appearance="danger" isSpacious />
		</div>
	);
}

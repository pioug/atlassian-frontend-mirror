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

export default function DateLabelDropdownTriggerExample(): React.JSX.Element {
	return (
		<div css={styles.wrapper}>
			<DateLabelDropdownTrigger label="29 Jul 2026" appearance="neutral" />
			<DateLabelDropdownTrigger label="29 Jul 2026" appearance="warning" />
			<DateLabelDropdownTrigger label="29 Jul 2026" appearance="danger" />
		</div>
	);
}

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { DateLabelDropdownTrigger } from '@atlaskit/date-label';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		alignItems: 'flex-start',
	},
});

export default function DateLabelDropdownTriggerLoading(): React.JSX.Element {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div css={styles.wrapper}>
			<button type="button" onClick={() => setIsLoading((loading) => !loading)}>
				{isLoading ? 'Stop loading' : 'Start loading'}
			</button>
			<div>
				<DateLabelDropdownTrigger label="29 Jul 2026" appearance="neutral" isLoading={isLoading} />
			</div>
			<div>
				<DateLabelDropdownTrigger label="29 Jul 2026" appearance="warning" isLoading={isLoading} />
			</div>
			<div>
				<DateLabelDropdownTrigger label="29 Jul 2026" appearance="danger" isLoading={isLoading} />
			</div>
		</div>
	);
}

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
		gap: token('space.100'),
		flexWrap: 'wrap',
		alignItems: 'center',
	},
});

export default function DateLabelDropdownTriggerSelected(): React.JSX.Element {
	const [isSelected, setIsSelected] = useState(false);

	return (
		<div css={styles.wrapper}>
			<DateLabelDropdownTrigger
				label="29 Jul 2026"
				appearance="neutral"
				isSelected={isSelected}
				onClick={() => setIsSelected((s) => !s)}
				aria-expanded={isSelected}
				aria-haspopup
			/>
			<DateLabelDropdownTrigger
				label="29 Jul 2026"
				appearance="warning"
				isSelected={isSelected}
				onClick={() => setIsSelected((s) => !s)}
				aria-expanded={isSelected}
				aria-haspopup
			/>
			<DateLabelDropdownTrigger
				label="29 Jul 2026"
				appearance="danger"
				isSelected={isSelected}
				onClick={() => setIsSelected((s) => !s)}
				aria-expanded={isSelected}
				aria-haspopup
			/>
		</div>
	);
}

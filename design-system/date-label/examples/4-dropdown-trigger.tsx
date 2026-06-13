/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';
import { DateLabelDropdownTrigger } from '@atlaskit/date-label';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	column: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
	},
	row: {
		display: 'flex',
		gap: token('space.100'),
		flexWrap: 'wrap',
		alignItems: 'center',
	},
});

/**
 * DateLabelDropdownTrigger — an interactive date label that acts as a dropdown trigger.
 * Renders as a button with hover, pressed, and focus ring states, plus a chevron icon.
 */
export default function DropdownTrigger(): React.JSX.Element {
	return (
		<div css={styles.column}>
			<div css={styles.row}>
				<DateLabelDropdownTrigger
					label="29 Jul 2026"
					appearance="neutral"
					testId="date-label-dropdown-neutral"
				/>
				<DateLabelDropdownTrigger
					label="29 Jul 2026"
					appearance="warning"
					testId="date-label-dropdown-warning"
				/>
				<DateLabelDropdownTrigger
					label="29 Jul 2026"
					appearance="danger"
					testId="date-label-dropdown-danger"
				/>
			</div>
			<div css={styles.row}>
				<DateLabelDropdownTrigger
					label="29 Jul 2026"
					appearance="neutral"
					isSpacious
					testId="date-label-dropdown-neutral-spacious"
				/>
				<DateLabelDropdownTrigger
					label="29 Jul 2026"
					appearance="warning"
					isSpacious
					testId="date-label-dropdown-warning-spacious"
				/>
				<DateLabelDropdownTrigger
					label="29 Jul 2026"
					appearance="danger"
					isSpacious
					testId="date-label-dropdown-danger-spacious"
				/>
			</div>
			<div css={styles.row}>
				<DateLabelDropdownTrigger
					label="29 Jul 2026"
					appearance="neutral"
					hasIconBefore={false}
					testId="date-label-dropdown-no-icon"
				/>
				<DateLabelDropdownTrigger
					label="29 Jul 2026"
					appearance="neutral"
					hasIconBefore={false}
					isSpacious
					testId="date-label-dropdown-no-icon-spacious"
				/>
			</div>
			<div css={styles.row}>
				<Text>Selected:</Text>
				<DateLabelDropdownTrigger
					label="29 Jul 2026"
					appearance="neutral"
					isSelected
					testId="date-label-dropdown-neutral-selected"
				/>
				<DateLabelDropdownTrigger
					label="29 Jul 2026"
					appearance="warning"
					isSelected
					testId="date-label-dropdown-warning-selected"
				/>
				<DateLabelDropdownTrigger
					label="29 Jul 2026"
					appearance="danger"
					isSelected
					testId="date-label-dropdown-danger-selected"
				/>
			</div>
		</div>
	);
}

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';
import DateLabel from '@atlaskit/date-label';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapper: {
		display: 'flex',
		gap: token('space.100'),
		flexWrap: 'wrap',
	},
});

/**
 * Basic example showing all three appearances of DateLabel with icons (default).
 */
export default function Basic(): React.JSX.Element {
	return (
		<div css={styles.wrapper}>
			<DateLabel label="29 Jul 2026" appearance="neutral" testId="date-label" />
			<DateLabel label="29 Jul 2026" appearance="warning" />
			<DateLabel label="29 Jul 2026" appearance="danger" />
		</div>
	);
}

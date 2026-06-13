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
		flexDirection: 'column',
		gap: token('space.100'),
	},
});

export default function DateLabelMaxWidth(): React.JSX.Element {
	return (
		<div css={styles.wrapper}>
			<DateLabel label="29 Jul 2026" appearance="neutral" maxWidth={60} />
			<DateLabel
				label="A very long date label that will be truncated"
				appearance="warning"
				maxWidth={150}
			/>
		</div>
	);
}

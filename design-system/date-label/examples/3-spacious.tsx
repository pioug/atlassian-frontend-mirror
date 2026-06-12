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
 * DateLabel with isSpacious — increases padding, height (32px), and uses body font size.
 */
export default function Spacious(): React.JSX.Element {
	return (
		<div css={styles.wrapper}>
			<DateLabel label="29 Jul 2026" appearance="neutral" isSpacious testId="date-label-spacious" />
			<DateLabel label="29 Jul 2026" appearance="warning" isSpacious />
			<DateLabel label="29 Jul 2026" appearance="danger" isSpacious />
		</div>
	);
}

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
 * DateLabel without icons — set hasIconBefore to false.
 */
export default function NoIcon(): React.JSX.Element {
	return (
		<div css={styles.wrapper}>
			<DateLabel label="29 Jul 2026" appearance="neutral" hasIconBefore={false} />
			<DateLabel label="29 Jul 2026" appearance="warning" hasIconBefore={false} />
			<DateLabel label="29 Jul 2026" appearance="danger" hasIconBefore={false} />
		</div>
	);
}

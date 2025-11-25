/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export interface PanelSubheaderProps {
	/**
	 * The title text to display in the subheader.
	 */
	title: string;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

const styles = cssMap({
	subheader: {
		paddingInlineStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.150'),
	},
});

/**
 * The PanelSubheader component provides a slot for subheaders with a title.
 */
export function PanelSubheader({ title, testId }: PanelSubheaderProps) {
	return (
		<Box testId={testId} xcss={styles.subheader}>
			<Heading size="medium">{title}</Heading>
		</Box>
	);
}

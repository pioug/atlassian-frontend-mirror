/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const styles = css({
	width: '100%',
	borderBlockEnd: 'none',
	borderBlockStart: `1px solid ${token('color.border')}`,
	borderInline: 'none',
});

/**
 * __Divider__
 *
 * A divider for use between menu sections.
 */
export const Divider = () => (
	<hr
		/**
		 * The existing usage of these dividers is presentational,
		 * so we are removing the separator semantics by default.
		 *
		 * In the future we may consider allowing opt-in separator semantics,
		 * but it probably isn't necessary.
		 */
		role="none"
		css={styles}
	/>
);

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: { padding: token('space.100') },
});

export default () => (
	<div data-testid="inline-example" css={styles.container}>
		<Inline space="space.150" separator="/">
			<a href="/">breadcrumbs</a>
			<a href="/">for</a>
			<a href="/">some</a>
			<a href="/">sub</a>
			<a href="/">page</a>
		</Inline>
	</div>
);

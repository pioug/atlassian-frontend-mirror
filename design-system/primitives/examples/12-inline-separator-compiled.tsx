/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Inline } from '../src/compiled';

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

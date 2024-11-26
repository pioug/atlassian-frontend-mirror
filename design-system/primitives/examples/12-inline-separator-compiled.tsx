/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Link from '@atlaskit/link';
import { Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: { padding: token('space.100') },
});

export default () => (
	<div data-testid="inline-example" css={styles.container}>
		<Inline space="space.150" separator="/">
			<Link href="/">breadcrumbs</Link>
			<Link href="/">for</Link>
			<Link href="/">some</Link>
			<Link href="/">sub</Link>
			<Link href="/">page</Link>
		</Inline>
	</div>
);

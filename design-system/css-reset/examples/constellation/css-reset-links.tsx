import React from 'react';

import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';

const CSSResetLinksExample = () => (
	<div data-testid="css-reset">
		<p>
			{fg('dst-a11y__replace-anchor-with-link__design-system-') ? (
				<Link href=".">Standard link</Link>
			) : (
				// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
				<a href=".">Standard link</a>
			)}
		</p>
		<p>
			Link with descenders:{' '}
			{fg('dst-a11y__replace-anchor-with-link__design-system-') ? (
				<Link href=".">jump quickly!</Link>
			) : (
				// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
				<a href=".">jump quickly!</a>
			)}
		</p>
		<h2>
			Link in a{' '}
			{fg('dst-a11y__replace-anchor-with-link__design-system-') ? (
				<Link href=".">heading</Link>
			) : (
				// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
				<a href=".">heading</a>
			)}
		</h2>
		<ul>
			<li>
				{fg('dst-a11y__replace-anchor-with-link__design-system-') ? (
					<Link href=".">links can also</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a href=".">links can also</a>
				)}
			</li>
			<li>
				{fg('dst-a11y__replace-anchor-with-link__design-system-') ? (
					<Link href=".">appear in lists</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a href=".">appear in lists</a>
				)}
			</li>
			<li>
				{fg('dst-a11y__replace-anchor-with-link__design-system-') ? (
					<Link href=".">like this</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a href=".">like this</a>
				)}
			</li>
		</ul>
	</div>
);

export default CSSResetLinksExample;

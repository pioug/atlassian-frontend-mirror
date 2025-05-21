import React from 'react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';

/**
 * By default the Atlaskit website includes css-reset in examples
 * when implementing css-reset in your application,
 * please include the stylesheet in head as `<link href="<path to css-reset>" rel="stylesheet" />`
 * or import '@atlaskit/css-reset' in your application code
 */
export default () => (
	<>
		<Banner appearance="warning" icon={<WarningIcon label="Warning" secondaryColor="inherit" />}>
			You should not rely on the default styles of links in your application. Use the{' '}
			<Link href="https://atlassian.design/components/link/examples">Link component</Link> instead.
		</Banner>
		<div data-testid="css-reset">
			<dl>
				<dt>Standard link</dt>
				<dd>
					{fg('dst-a11y__replace-anchor-with-link__design-system-') ? (
						<Link href=".">Standard link example</Link>
					) : (
						// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
						<a href=".">Standard link example</a>
					)}
				</dd>
				<dt>Link with descenders</dt>
				<dd>
					{fg('dst-a11y__replace-anchor-with-link__design-system-') ? (
						<Link href=".">Link with descenders example</Link>
					) : (
						// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
						<a href=".">Link with descenders example</a>
					)}
				</dd>
				<dt>Link in a heading</dt>
				<dd>
					<h2>
						{fg('dst-a11y__replace-anchor-with-link__design-system-') ? (
							<Link href=".">Link in a heading example</Link>
						) : (
							// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
							<a href=".">Link in a heading example</a>
						)}
					</h2>
				</dd>
			</dl>
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
	</>
);

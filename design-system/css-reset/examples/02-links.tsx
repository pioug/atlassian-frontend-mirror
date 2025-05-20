import React from 'react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Link from '@atlaskit/link';

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
					<a href=".">Standard link example</a>
				</dd>
				<dt>Link with descenders</dt>
				<dd>
					<a href=".">Link with descenders example</a>
				</dd>
				<dt>Link in a heading</dt>
				<dd>
					<h2>
						<a href=".">Link in a heading example</a>
					</h2>
				</dd>
			</dl>
			<ul>
				<li>
					<a href=".">links can also</a>
				</li>
				<li>
					<a href=".">appear in lists</a>
				</li>
				<li>
					<a href=".">like this</a>
				</li>
			</ul>
		</div>
	</>
);

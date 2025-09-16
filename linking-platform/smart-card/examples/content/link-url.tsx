import React from 'react';

import Link from '@atlaskit/link';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { UnAuthClient } from '@atlaskit/link-test-helpers';

import LinkUrl from '../../src/view/LinkUrl';

export default () => (
	<div>
		<h2>Link safety warning</h2>
		<ul>
			<li>
				Link description is a URL and it's different from a destination.
				<br />
				<LinkUrl href="https://www.google.com/">atlassian.com</LinkUrl>
			</li>
		</ul>
		<h2>No link safety warning</h2>
		<ul>
			<li>
				Link description is a plain text.
				<br />
				<LinkUrl href="https://www.google.com/">Here is a google link</LinkUrl>
			</li>
			<li>
				Link description is a URL identical to a destination.
				<br />
				<LinkUrl href="https://www.atlassian.com/solutions/devops">
					https://www.atlassian.com/solutions/devops
				</LinkUrl>
			</li>
			<li>
				Link is a multi-line URL.
				<br />
				<LinkUrl href="https://www.atlassian.com/solutions/devops">
					<p>Help</p>
					<Link href="https://www.atlassian.com/solutions/devops">
						https://www.atlassian.com/solutions/devops
					</Link>
				</LinkUrl>
			</li>
			<li>
				Link is a multi-line URL.
				<br />
				<LinkUrl href="https://hello.atlassian.com/wiki">
					<div>Help</div>
					<span>https://hello.atlas...</span>
				</LinkUrl>
			</li>
		</ul>
		<h2>Link with smart link resolver</h2>
		<ul>
			<li>
				This link trigger smart link resolver
				<br />
				<SmartCardProvider client={new CardClient('stg')}>
					<LinkUrl enableResolve={true} href="https://www.google.com/">
						https://www.resolved-link.com/
					</LinkUrl>
				</SmartCardProvider>
			</li>
			<li>
				This link trigger smart link resolver with unauth
				<br />
				<SmartCardProvider client={new UnAuthClient()}>
					<LinkUrl enableResolve={true} href="https://www.unauth-link.com/">
						https://www.unauth-link.com/
					</LinkUrl>
				</SmartCardProvider>
			</li>
		</ul>
	</div>
);

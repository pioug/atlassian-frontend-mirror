import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import React from 'react';
import SectionMessage from '@atlaskit/section-message';

export function createSingletonNotice(componentName: string) {
	const title = `${componentName} is a singleton package`;
	return (
		<SectionMessage title={title} appearance="error">
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<p>
				Having multiple versions of {componentName} installed can result in potential issues, such
				as media preview failures.
			</p>
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<p>
				You must ensure that your application dependencies only resolve to a unique package version,
				if you are:
				<ul>
					<li>
						<b>A platform consumer</b> — i.e. you are using {componentName} directly in a npm
						package, for instance in a monorepo. Define {componentName} in your package.json file as
						{/* eslint-disable-next-line @atlaskit/design-system/no-html-code */}a{' '}
						<code>peerDependency</code> and <code>devDependency</code> (for local testing).
					</li>
					<li>
						<b>A product consumer</b> — i.e. you are working directly into your application. Define{' '}
						{componentName} in your package.json file as a direct dependency.
					</li>
				</ul>
			</p>
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<p>
				If you have any questions or need assistance in consuming this package correctly, please
				reach out to the{' '}
				{fg('dst-a11y__replace-anchor-with-link__media-exif') ? (
					<Link href="https://atlassian.slack.com/archives/C05J5GNHPLN" target="_blank">
						#help-media-platform
					</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a href="https://atlassian.slack.com/archives/C05J5GNHPLN" target="_blank">
						#help-media-platform
					</a>
				)}{' '}
				channel.
			</p>
		</SectionMessage>
	);
}

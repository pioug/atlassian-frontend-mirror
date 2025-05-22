import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import React from 'react';
import SectionMessage from '@atlaskit/section-message';

export function createRxjsNotice(componentName: string) {
	return (
		<SectionMessage title="RxJS compatibility" appearance="warning">
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<p>
				{componentName} currently requires{' '}
				{fg('dst-a11y__replace-anchor-with-link__media-exif') ? (
					<Link href="https://www.npmjs.com/package/rxjs/v/5.5.12">rxjs@^5.5.0</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a href="https://www.npmjs.com/package/rxjs/v/5.5.12">rxjs@^5.5.0</a>
				)}{' '}
				as peer dependency.
			</p>
		</SectionMessage>
	);
}

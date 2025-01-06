import React from 'react';
import SectionMessage from '@atlaskit/section-message';

export function createRxjsNotice(componentName: string) {
	return (
		<SectionMessage title="RxJS compatibility" appearance="warning">
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<p>
				{componentName} currently requires{' '}
				<a href="https://www.npmjs.com/package/rxjs/v/5.5.12">rxjs@^5.5.0</a> as peer dependency.
			</p>
		</SectionMessage>
	);
}

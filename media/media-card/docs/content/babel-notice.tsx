import Link from '@atlaskit/link';
import React from 'react';
import SectionMessage from '@atlaskit/section-message';

export default function BabelNotice() {
	return (
		<SectionMessage title={`Note : `} appearance="warning">
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<p>
				Don't forget to add polyfills for fetch, ES6 & ES7 to your product build if you want to
				target older browsers. We recommend the use of{' '}
				<Link href="https://babeljs.io/docs/plugins/preset-env/">babel-preset-env</Link> &{' '}
				<Link href="https://babeljs.io/docs/usage/polyfill/">babel-polyfill</Link>
			</p>
		</SectionMessage>
	);
}

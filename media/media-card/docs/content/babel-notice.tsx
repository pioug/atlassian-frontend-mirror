import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import React from 'react';
import SectionMessage from '@atlaskit/section-message';

export default function BabelNotice() {
	return (
		<SectionMessage title={`Note : `} appearance="warning">
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<p>
				Don't forget to add polyfills for fetch, ES6 & ES7 to your product build if you want to
				target older browsers. We recommend the use of{' '}
				{fg('dst-a11y__replace-anchor-with-link__media-exif') ? (
					<Link href="https://babeljs.io/docs/plugins/preset-env/">babel-preset-env</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a href="https://babeljs.io/docs/plugins/preset-env/">babel-preset-env</a>
				)}{' '}
				&{' '}
				{fg('dst-a11y__replace-anchor-with-link__media-exif') ? (
					<Link href="https://babeljs.io/docs/usage/polyfill/">babel-polyfill</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a href="https://babeljs.io/docs/usage/polyfill/">babel-polyfill</a>
				)}
			</p>
		</SectionMessage>
	);
}

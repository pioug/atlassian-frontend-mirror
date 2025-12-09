import React from 'react';

import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import SectionMessage from '@atlaskit/section-message';

function AlternativePackagesMessage({
	alternatePackages,
}: React.PropsWithoutRef<{
	alternatePackages?: { link: string; name: string }[];
}>) {
	if (!alternatePackages) {
		return null;
	}
	if (alternatePackages.length === 1) {
		return (
			<p>
				Consider using{' '}
				{fg('dst-a11y__replace-anchor-with-link__editor-lego') ? (
					<Link href={alternatePackages[0].link}>{alternatePackages[0].name}</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a href={alternatePackages[0].link}>{alternatePackages[0].name}</a>
				)}
				instead.
			</p>
		);
	}
	return (
		<p>
			Consider using one of these packages instead:
			<ul>
				{alternatePackages.map((p) => (
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-key
					<li>
						{fg('dst-a11y__replace-anchor-with-link__editor-lego') ? (
							<Link href={p.link}>{p.name}</Link>
						) : (
							// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
							<a href={p.link}>{p.name}</a>
						)}
					</li>
				))}
			</ul>
		</p>
	);
}

export function createEditorUseOnlyNotice(
	componentName: string,
	alternatePackages?: { link: string; name: string }[],
): React.JSX.Element {
	return (
		<SectionMessage title="Internal Editor Use Only" appearance="error">
			<p>
				{componentName} is intended for internal use by the Editor Platform as a plugin dependency
				of the Editor within your product.
			</p>
			<p>Direct use of this component is not supported.</p>
			<AlternativePackagesMessage alternatePackages={alternatePackages} />
		</SectionMessage>
	);
}

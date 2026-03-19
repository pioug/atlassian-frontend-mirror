import React, { useEffect, useState } from 'react';

import { metaDataWithPackageLoader as objectIconMetadata } from '@atlaskit/icon-object/metadata';

type IconEntry = {
	name: string;
	Component: React.ComponentType<any>;
};

// NOTE: `@atlaskit/icon-object` is deprecated and will be replaced by `design-system/object`.
// This example renders a subset of object icons using the package loader metadata.
export default function IconExamples(): React.JSX.Element {
	const [icons, setIcons] = useState<IconEntry[]>([]);

	useEffect(() => {
		let mounted = true;
		(async () => {
			const entries = Object.entries(objectIconMetadata).slice(0, 100);
			const loaded = await Promise.all(
				entries.map(async ([name, { packageLoader }]) => {
					const mod = await packageLoader();
					return { name, Component: mod.default };
				}),
			);
			if (mounted) {
				setIcons(loaded);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div data-testid="root">
			<div data-testid="light-root">
				<div>
					{icons.map(({ name, Component }) => (
						<Component key={name} label={name} />
					))}
				</div>
			</div>
		</div>
	);
}

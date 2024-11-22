import React, { useEffect, useState } from 'react';

import coreIconLabMetadata from '../src/entry-points/metadata';

type composedMetadata = (typeof coreIconLabMetadata)[string] & { component: any };

const coreIcons: Promise<{
	[index: string]: composedMetadata;
}> = Promise.all(
	Object.keys(coreIconLabMetadata).map(async (name: string) => {
		const icon = await import(`../core/${name}.js`);
		return { name, icon: icon.default };
	}),
).then((newData) =>
	newData
		.map((icon) => ({
			[icon.name]: {
				...(coreIconLabMetadata as { [key: string]: (typeof coreIconLabMetadata)[string] })[
					icon.name
				],
				component: icon.icon,
			},
		}))
		.reduce((acc, b) => ({ ...acc, ...b })),
);

export default function Basic() {
	const [allIcons, setAllIcons] = useState({});

	useEffect(() => {
		coreIcons.then(setAllIcons);
	}, [setAllIcons]);

	return (
		<div>
			{Object.entries(allIcons as { [key: string]: composedMetadata }).map(
				([key, { component: Icon }]) => {
					return <Icon key={key} label={key} />;
				},
			)}
		</div>
	);
}

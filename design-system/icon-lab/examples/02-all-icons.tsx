import React, { useEffect, useState } from 'react';

import metadata from '../src/entry-points/metadata';

type composedMetadata = (typeof metadata)[string] & { component: any };

const coreIcons: Promise<{
	[index: string]: composedMetadata;
}> = Promise.all(
	Object.keys(metadata).map(async (name: string) => {
		const icon = await import(`../core/${name}.js`);
		return { name, icon: icon.default };
	}),
).then((newData) =>
	newData
		.map((icon) => ({
			[icon.name]: {
				...(metadata as { [key: string]: (typeof metadata)[string] })[icon.name],
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

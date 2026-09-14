import React from 'react';

import loremIpsum from 'lorem-ipsum';

const createSeededRandom = (initialSeed: number) => {
	let seed = initialSeed;

	return () => {
		if (seed >= 9007199254740992) {
			seed = 0;
		}

		const x = Math.sin(0.8765111159592828 + seed++) * 10000;
		return x - Math.floor(x);
	};
};

export const Lorem = ({ count }: { count: number }): React.JSX.Element =>
	React.createElement('div', {
		dangerouslySetInnerHTML: {
			__html: loremIpsum({
				count,
				units: 'paragraphs',
				format: 'html',
				random: createSeededRandom(0),
			}),
		},
	});

export default function LoremExample(): React.JSX.Element {
	return <Lorem count={1} />;
}

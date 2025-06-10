import React from 'react';

import metadata from '@atlaskit/icon/metadata';

const icons16 = Object.keys(metadata)
	.map((name) => {
		if (name.includes('16')) {
			return require(`../src/artifacts/glyph/${name}`).default;
		}

		return null;
	})
	.filter(Boolean);

const icons24 = Object.keys(metadata)
	.map((name) => {
		if (name.includes('24')) {
			return require(`../src/artifacts/glyph/${name}`).default;
		}

		return null;
	})
	.filter(Boolean);

export default function IconExamples() {
	return (
		<div data-testid="root">
			<div data-testid="light-root">
				<div>
					{icons16.map((Icon, index) => (
						<Icon key={index} />
					))}
				</div>
				<div>
					{icons24.map((Icon, index) => (
						<Icon key={index} />
					))}
				</div>
			</div>
		</div>
	);
}

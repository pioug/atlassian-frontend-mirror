import fs from 'fs';
import path from 'path';

import metadata from '../../metadata-animated';

const animatedDir = path.join(__dirname, '../../animated');
const iconNames = fs
	.readdirSync(animatedDir)
	.filter((file) => file.endsWith('.tsx'))
	.map((file) => file.replace(/\.tsx$/, ''))
	.sort();

describe('animated icon metadata', () => {
	it('has an entry for every animated icon, and no others', () => {
		expect(Object.keys(metadata).sort()).toEqual(iconNames);
	});

	it.each(iconNames)('%s points at its own entry point and component', async (name) => {
		const { default: Icon } = await import(`../../animated/${name}`);

		expect(metadata[name].package).toBe(`@atlaskit/icon/animated/${name}`);
		expect(metadata[name].componentName).toBe(Icon.displayName);
	});
});

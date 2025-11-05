import { getComponentsTool } from '../../src/tools/get-components';

jest.mock('../../src/tools/get-components/components', () => {
	/**
	 * This tool just encodes the generated data from codegen, its internal logic doesn't manipulate it at all
	 */
	const arbitraryObject = {
		example: 'values',
	};
	return {
		components: [arbitraryObject],
	};
});

describe('ads_get_components tool', () => {
	it('Lists the components in JSON format', async () => {
		const [resultComponent] = (await getComponentsTool()).content;
		expect(resultComponent.type).toEqual('text');
		expect(resultComponent.text).toEqual(JSON.stringify({ example: 'values' }, null, 2));
	});
});

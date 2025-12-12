import { text } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema taskList node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(text).toStrictEqual({
			group: 'inline',
		});
	});
});

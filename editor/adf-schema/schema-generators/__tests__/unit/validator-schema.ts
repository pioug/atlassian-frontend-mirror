import { doc } from '@atlaskit/adf-schema/schema-validator';

describe('ADF Validator schema entry-point', () => {
	it('should have the doc node', function () {
		expect(doc.props.type.values).toEqual(['doc']);
	});
});

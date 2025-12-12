import { doc } from '../../../..';

import { normalizeNodeSpec } from '../../_utils';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema doc node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	// @DSLCompatibilityException
	// marks is in different order comparing with original marks
	it('should return correct node spec', () => {
		expect(normalizeNodeSpec(doc)).toStrictEqual(
			normalizeNodeSpec({
				content:
					'(block | codeBlock | layoutSection | blockRootOnly | expand | syncBlock | bodiedSyncBlock)+',
				marks:
					'alignment breakout dataConsumer fragment indentation unsupportedMark unsupportedNodeAttribute',
			}),
		);
	});
});

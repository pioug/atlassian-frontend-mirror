import { adfNode } from '../../../adfNode';
import { adfToValidatorSpec } from '../../../transforms/adfToValidatorSpec/adfToValidatorSpec';
import type { ValidatorSpecNode } from '../../../transforms/adfToValidatorSpec/ValidatorSpec';
import { $or } from '../../../$or';

describe('ignored nodes', () => {
	it('should not include ignored node in the output', () => {
		const ignoredNode = adfNode('ignoredNode').define({
			ignore: ['validator-spec'],
		});
		const nonIgnoredNode = adfNode('nonIgnoredNode').define({});
		const node = adfNode('paragraph').define({
			root: true,
			content: [$or(nonIgnoredNode, ignoredNode)],
		});
		const result = adfToValidatorSpec(node);
		expect(result.ignoredNode).not.toBeDefined();
		expect((result.paragraph.json as ValidatorSpecNode).props.content?.items).toEqual([
			'nonIgnoredNode',
		]);
	});
});

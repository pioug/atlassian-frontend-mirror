import { adfNode } from '../../../adfNode';
import { adfMark } from '../../../adfMark';
import { $or } from '../../../$or';
import { adfToValidatorSpec } from '../../../transforms/adfToValidatorSpec/adfToValidatorSpec';

test('should always use stage0 spec', () => {
	const strong = adfMark('strong').define({});
	const text = adfNode('text').define({
		stage0: {
			marks: [strong],
		},
	});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(text)],
	});
	const result = adfToValidatorSpec(node);
	// @ts-expect-error - props might not exist according to types, but it is not the case for this test
	expect(result?.text?.json?.props?.marks?.items).toContain('strong');
});

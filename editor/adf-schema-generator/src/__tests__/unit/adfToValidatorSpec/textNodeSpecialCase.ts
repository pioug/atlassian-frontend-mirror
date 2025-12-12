import { adfNode } from '../../../adfNode';
import { $or } from '../../../$or';
import { adfToValidatorSpec } from '../../../transforms/adfToValidatorSpec/adfToValidatorSpec';
import type { ValidatorSpecNode } from '../../../transforms/adfToValidatorSpec/ValidatorSpec';

test('should add text property to text node [special case]', () => {
	const text = adfNode('text').define({});
	const node = adfNode('p').define({
		root: true,
		content: [$or(text)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.text.json as ValidatorSpecNode).props.text).toEqual({
		minLength: 1,
		type: 'string',
	});
});

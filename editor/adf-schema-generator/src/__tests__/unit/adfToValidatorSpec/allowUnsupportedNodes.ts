import { adfNode } from '../../../adfNode';
import { adfNodeGroup } from '../../../adfNodeGroup';
import { $or } from '../../../$or';
import { adfToValidatorSpec } from '../../../transforms/adfToValidatorSpec/adfToValidatorSpec';
import type { ValidatorSpecNode } from '../../../transforms/adfToValidatorSpec/ValidatorSpec';

test('should add allowUnsupportedBlock to the output if any child of a node is unsupportedBlock', () => {
	const unsupportedNode = adfNode('unsupportedBlock').define({
		ignore: ['validator-spec'],
	});
	const child = adfNode('child').define({});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(unsupportedNode, child)],
	});
	const result = adfToValidatorSpec(node);
	expect((result?.paragraph?.json as ValidatorSpecNode).props?.content?.allowUnsupportedBlock).toBe(
		true,
	);
});

test('should add allowUnsupportedInline to the output if any child of a node is unsupportedInline', () => {
	const unsupportedNode = adfNode('unsupportedInline').define({
		ignore: ['validator-spec'],
	});
	const child = adfNode('child').define({});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(child, unsupportedNode)],
	});
	const result = adfToValidatorSpec(node);
	expect(
		(result?.paragraph?.json as ValidatorSpecNode).props?.content?.allowUnsupportedInline,
	).toBe(true);
});

test('should add allowUnsupportedBlock to the output if any group in content of a node has an unsupportedBlock', () => {
	const unsupportedNode = adfNode('unsupportedBlock').define({
		ignore: ['validator-spec'],
	});
	const group = adfNodeGroup('group', [unsupportedNode]);
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(group)],
	});
	const result = adfToValidatorSpec(node);
	expect((result?.paragraph?.json as ValidatorSpecNode).props?.content?.allowUnsupportedBlock).toBe(
		true,
	);
});

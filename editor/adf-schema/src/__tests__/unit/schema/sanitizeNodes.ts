import { sanitizeNodes } from '../../../schema/sanitizeNodes';

it('should remove unsupported block with * modifier from content', () => {
	const content = '(node2 | unsupportedBlock){2,3} unsupportedBlock*';
	const nodes = {
		node1: { content },
		node2: { content: 'node2' },
	};
	const cleanNodes = sanitizeNodes(nodes, {});
	expect(cleanNodes.node1.content).toEqual('(node2 ){2,3}');
});

it('should remove unsupported block with + modifier from content', () => {
	const content = '(node2 | unsupportedBlock){2,3} unsupportedBlock+';
	const nodes = {
		node1: { content },
		node2: { content: 'node2' },
	};
	const cleanNodes = sanitizeNodes(nodes, {});
	expect(cleanNodes.node1.content).toEqual('(node2 ){2,3}');
});

it('should remove unsupported block with unsupportedBlock * | unsupportedBlock+ combination from content', () => {
	const content = '(node2 | unsupportedBlock){2,3} unsupportedBlock* | unsupportedBlock+';
	const nodes = {
		node1: { content },
		node2: { content: 'node2' },
	};
	const cleanNodes = sanitizeNodes(nodes, {});
	expect(cleanNodes.node1.content).toEqual('(node2 ){2,3}');
});

it('should remove longer unsupported variant names before their base names', () => {
	const content = '(paragraph | mediaSingle | mediaSingle_full | panel | panel_c1 | table)+';
	const nodes = {
		node1: { content },
		paragraph: { content: 'paragraph' },
		mediaSingle: { content: 'mediaSingle' },
		table: { content: 'table' },
	};

	const cleanNodes = sanitizeNodes(nodes, {});

	expect(cleanNodes.node1.content).toEqual('(paragraph | mediaSingle | table)+');
});

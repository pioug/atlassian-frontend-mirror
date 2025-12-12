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

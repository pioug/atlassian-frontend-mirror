import { transform } from '../../../transforms/adfToPm/adfToPm';
import { adfNode } from '../../../adfNode';
import { adfNodeGroup } from '../../../adfNodeGroup';
import { adfMark } from '../../../adfMark';
import { $or } from '../../../$or';

test('should produce 2 specs for a node with stage0 partial override', () => {
	const strong = adfMark('strong').define({});
	const p = adfNode('paragraph').define({
		stage0: {
			marks: [strong],
		},
	});
	const doc = adfNode('doc').define({ root: true, content: [$or(p)] });
	const res = transform(doc);
	expect(res.nodeResMap.paragraph).toBeDefined();
	expect(res.nodeResMap.paragraph_stage0).toBeDefined();
});

test('should produce 2 specs for a node with stage0 partial override if a node is inside of a group', () => {
	const strong = adfMark('strong').define({});
	const p = adfNode('paragraph').define({
		stage0: {
			marks: [strong],
		},
	});
	const group = adfNodeGroup('block', [p]);
	const doc = adfNode('doc').define({ root: true, content: [$or(group)] });
	const res = transform(doc);
	expect(res.nodeResMap.paragraph).toBeDefined();
	expect(res.nodeResMap.paragraph_stage0).toBeDefined();
});

test('should produce only 1 specs for a stage0 node', () => {
	const strong = adfMark('strong').define({});
	const p = adfNode('paragraph').define({
		marks: [strong],
		stage0: true,
	});
	const doc = adfNode('doc').define({ root: true, content: [$or(p)] });
	const res = transform(doc);
	expect(res.nodeResMap.paragraph_stage0).toBeDefined();
});

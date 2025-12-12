import { adfMark } from '../../adfMark';
import { adfMarkGroup } from '../../adfMarkGroup';
import { PMSpecTransformerName } from '../../transforms/transformerNames';

test('should define a mark', () => {
	const mark = adfMark('link').define({
		inclusive: true,
	});
	expect(mark.getSpec().inclusive).toBe(true);
});

test('should add a group to a mark', () => {
	const mark = adfMark('link').define({
		inclusive: true,
	});
	const group = adfMarkGroup('inline', [mark]);
	expect(group.members).toContain(mark);
});

test('should not allow re-defining a mark', () => {
	const mark = adfMark('link').define({});

	expect(() => {
		mark.define({});
	}).toThrow();
});

test('should get name', () => {
	const mark = adfMark('link').define({});
	expect(mark.getName()).toBe('link_mark');
});

test('should return true if mark is ignored by a transformer', () => {
	const mark = adfMark('link').define({
		ignore: ['pm-spec'],
	});

	expect(mark.isIgnored(PMSpecTransformerName)).toBe(true);
});

test('should return false if node variant is not ignored by a transformer', () => {
	const mark = adfMark('link').define({
		ignore: ['json-schema'],
	});

	expect(mark.isIgnored(PMSpecTransformerName)).toBe(false);
});

import { adfNodeGroup } from '../../adfNodeGroup';

test('should not allow spaces in a group name', () => {
	expect(() => {
		adfNodeGroup('block inline', []);
	}).toThrow();
});

test('should allow ignoring a group', () => {
	const group = adfNodeGroup('block', [], {
		ignore: ['validator-spec'],
	});

	expect(group.isIgnored('validator-spec')).toBe(true);
});

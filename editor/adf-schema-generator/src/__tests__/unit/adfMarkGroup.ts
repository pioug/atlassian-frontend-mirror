import { adfMarkGroup } from '../../adfMarkGroup';

test('should not allow spaces in a group name', () => {
	expect(() => {
		adfMarkGroup('block inline', []);
	}).toThrow();
});

import { revFY25_01Classifier } from './fy25_01';

describe('classifier starts', () => {
	test('fy25.01 starts', () => {
		expect(
			revFY25_01Classifier.classifyUpdate({
				element: document.createElement('a'),
				type: 'dom',
				tags: ['not-visible'],
				ignoreReason: '',
			}),
		).toBeFalsy();
	});
});

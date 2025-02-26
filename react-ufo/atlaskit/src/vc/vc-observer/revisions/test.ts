import { revFY25_02Classifier } from './fy25_02';

describe('classifier starts', () => {
	test('fy25.02 starts', () => {
		expect(
			revFY25_02Classifier.classifyUpdate({
				element: document.createElement('a'),
				type: 'dom',
				tags: ['not-visible'],
				ignoreReason: '',
			}),
		).toBeFalsy();
	});
});

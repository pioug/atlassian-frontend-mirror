import { revFY25_02Classifier } from './fy25_02';

describe('classifier starts', () => {
	test('fy25.02 starts', () => {
		expect(
			revFY25_02Classifier.classifyUpdate({
				element: document.createElement('a'),
				type: 'html',
				tags: ['not-visible'],
				ignoreReason: 'not-visible',
			}),
		).toBeFalsy();

		expect(
			revFY25_02Classifier.classifyUpdate({
				element: document.createElement('a'),
				type: 'html',
				tags: [],
				ignoreReason: 'image',
			}),
		).toBeFalsy();

		expect(
			revFY25_02Classifier.classifyUpdate({
				element: document.createElement('a'),
				type: 'html',
				tags: [],
				ignoreReason: 'ssr-hydration',
			}),
		).toBeFalsy();

		expect(
			revFY25_02Classifier.classifyUpdate({
				element: document.createElement('a'),
				type: 'html',
				tags: [],
				ignoreReason: '',
			}),
		).toBeTruthy();
	});
});

// @ts-nocheck
import documentContainer from '../../src/plugin/document-container';

describe('Document Container', function () {
	var container;
	beforeEach(function () {
		container = document.createElement('div');
		document.body.appendChild(container);
	});

	afterEach(function () {
		document.body.removeChild(container);
	});

	it('#content', function () {
		container.id = 'content';
		expect(documentContainer()).toEqual(container);
	});

	it('.ac-content', function () {
		container.className = 'ac-content';
		expect(documentContainer()).toEqual(container);
	});

	it('body', function () {
		expect(documentContainer()).not.toEqual(container);
		expect(documentContainer()).toEqual(document.body);
	});
});

import { getDocument } from '@atlaskit/browser-apis';

import { isContainedWithinSmartAnswers } from './is-contained-within-smart-answers';

jest.mock('@atlaskit/browser-apis', () => ({
	getDocument: jest.fn(),
}));

const mockGetDocument = getDocument as jest.Mock;

describe('isContainedWithinSmartAnswers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return false when getDocument returns null', () => {
		mockGetDocument.mockReturnValue(null);

		const node = document.createElement('div');
		const result = isContainedWithinSmartAnswers(node);

		expect(result).toBe(false);
	});

	it('should return false when smart answers element does not exist', () => {
		const mockDocument = {
			getElementById: jest.fn().mockReturnValue(null),
		};
		mockGetDocument.mockReturnValue(mockDocument);

		const node = document.createElement('div');
		const result = isContainedWithinSmartAnswers(node);

		expect(result).toBe(false);
		expect(mockDocument.getElementById).toHaveBeenCalledWith('search-page-smart-answers');
	});

	it('should return true when node is contained within smart answers element', () => {
		const smartAnswersElement = document.createElement('div');
		const childNode = document.createElement('span');
		smartAnswersElement.appendChild(childNode);

		const mockDocument = {
			getElementById: jest.fn().mockReturnValue(smartAnswersElement),
		};
		mockGetDocument.mockReturnValue(mockDocument);

		const result = isContainedWithinSmartAnswers(childNode);

		expect(result).toBe(true);
		expect(mockDocument.getElementById).toHaveBeenCalledWith('search-page-smart-answers');
	});

	it('should return true when node is the smart answers element itself', () => {
		const smartAnswersElement = document.createElement('div');

		const mockDocument = {
			getElementById: jest.fn().mockReturnValue(smartAnswersElement),
		};
		mockGetDocument.mockReturnValue(mockDocument);

		const result = isContainedWithinSmartAnswers(smartAnswersElement);

		expect(result).toBe(true);
	});

	it('should return false when node is not contained within smart answers element', () => {
		const smartAnswersElement = document.createElement('div');
		const externalNode = document.createElement('div');

		const mockDocument = {
			getElementById: jest.fn().mockReturnValue(smartAnswersElement),
		};
		mockGetDocument.mockReturnValue(mockDocument);

		const result = isContainedWithinSmartAnswers(externalNode);

		expect(result).toBe(false);
	});

	it('should return true for deeply nested child within smart answers element', () => {
		const smartAnswersElement = document.createElement('div');
		const level1 = document.createElement('div');
		const level2 = document.createElement('div');
		const deeplyNestedNode = document.createElement('span');

		smartAnswersElement.appendChild(level1);
		level1.appendChild(level2);
		level2.appendChild(deeplyNestedNode);

		const mockDocument = {
			getElementById: jest.fn().mockReturnValue(smartAnswersElement),
		};
		mockGetDocument.mockReturnValue(mockDocument);

		const result = isContainedWithinSmartAnswers(deeplyNestedNode);

		expect(result).toBe(true);
	});

	it('should return false for sibling of smart answers element', () => {
		const parent = document.createElement('div');
		const smartAnswersElement = document.createElement('div');
		const siblingNode = document.createElement('div');

		parent.appendChild(smartAnswersElement);
		parent.appendChild(siblingNode);

		const mockDocument = {
			getElementById: jest.fn().mockReturnValue(smartAnswersElement),
		};
		mockGetDocument.mockReturnValue(mockDocument);

		const result = isContainedWithinSmartAnswers(siblingNode);

		expect(result).toBe(false);
	});
});

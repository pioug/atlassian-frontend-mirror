import { interactions } from '../common/constants';
import { addCohortingCustomData, addNewInteraction } from '../index';

describe('addCohortingCustomData', () => {
	beforeEach(() => {
		// Clear any existing interactions
		interactions.clear();
	});

	afterEach(() => {
		interactions.clear();
	});

	it('should add valid cohorting custom data to the interaction', () => {
		const interactionId = 'test-interaction-id';
		const labelStack = [{ name: 'test-segment' }];

		// Create a new interaction
		addNewInteraction(
			interactionId,
			'test-ufo-name',
			'page_load',
			performance.now(),
			1.0,
			labelStack,
		);

		// Add cohorting custom data
		addCohortingCustomData(interactionId, 'cohortKey', 'test-cohort');
		addCohortingCustomData(interactionId, 'experimentId', 'exp-123');
		addCohortingCustomData(interactionId, 'isEnabled', true);
		addCohortingCustomData(interactionId, 'count', 42);

		// Get the interaction and verify the data was added
		const interaction = interactions.get(interactionId);
		expect(interaction).toBeDefined();
		expect(interaction!.cohortingCustomData.get('cohortKey')).toBe('test-cohort');
		expect(interaction!.cohortingCustomData.get('experimentId')).toBe('exp-123');
		expect(interaction!.cohortingCustomData.get('isEnabled')).toBe(true);
		expect(interaction!.cohortingCustomData.get('count')).toBe(42);
		expect(interaction!.cohortingCustomData.size).toBe(4);
	});

	it('should reject non-primitive values', () => {
		const interactionId = 'test-interaction-id';
		const labelStack = [{ name: 'test-segment' }];

		// Create a new interaction
		addNewInteraction(
			interactionId,
			'test-ufo-name',
			'page_load',
			performance.now(),
			1.0,
			labelStack,
		);

		// Try to add invalid data
		addCohortingCustomData(interactionId, 'invalidKey', {} as any);
		addCohortingCustomData(interactionId, 'anotherInvalidKey', [] as any);
		addCohortingCustomData(interactionId, 'nullKey', null as any);
		addCohortingCustomData(interactionId, 'undefinedKey', undefined as any);

		// Verify no data was added for invalid types, but null/undefined are accepted
		const interaction = interactions.get(interactionId);
		expect(interaction!.cohortingCustomData.get('invalidKey')).toBeUndefined();
		expect(interaction!.cohortingCustomData.get('anotherInvalidKey')).toBeUndefined();
		expect(interaction!.cohortingCustomData.get('nullKey')).toBeNull();
		expect(interaction!.cohortingCustomData.get('undefinedKey')).toBeUndefined();
	});

	it('should reject strings longer than 50 characters', () => {
		const interactionId = 'test-interaction-id';
		const labelStack = [{ name: 'test-segment' }];

		// Create a new interaction
		addNewInteraction(
			interactionId,
			'test-ufo-name',
			'page_load',
			performance.now(),
			1.0,
			labelStack,
		);

		// Try to add a string that's too long
		const longString = 'a'.repeat(51);
		addCohortingCustomData(interactionId, 'longKey', longString);

		// Verify no data was added
		const interaction = interactions.get(interactionId);
		expect(interaction!.cohortingCustomData.size).toBe(0);
	});

	it('should accept strings exactly 50 characters long', () => {
		const interactionId = 'test-interaction-id';
		const labelStack = [{ name: 'test-segment' }];

		// Create a new interaction
		addNewInteraction(
			interactionId,
			'test-ufo-name',
			'page_load',
			performance.now(),
			1.0,
			labelStack,
		);

		// Add a string that's exactly 50 characters
		const exactString = 'a'.repeat(50);
		addCohortingCustomData(interactionId, 'exactKey', exactString);

		// Verify data was added
		const interaction = interactions.get(interactionId);
		expect(interaction!.cohortingCustomData.get('exactKey')).toBe(exactString);
		expect(interaction!.cohortingCustomData.size).toBe(1);
	});

	it('should handle duplicate keys by overwriting', () => {
		const interactionId = 'test-interaction-id';
		const labelStack = [{ name: 'test-segment' }];

		// Create a new interaction
		addNewInteraction(
			interactionId,
			'test-ufo-name',
			'page_load',
			performance.now(),
			1.0,
			labelStack,
		);

		// Add the same key twice with different values
		addCohortingCustomData(interactionId, 'duplicateKey', 'first-value');
		addCohortingCustomData(interactionId, 'duplicateKey', 'second-value');

		// Verify only the last value is stored
		const interaction = interactions.get(interactionId);
		expect(interaction!.cohortingCustomData.get('duplicateKey')).toBe('second-value');
		expect(interaction!.cohortingCustomData.size).toBe(1);
	});

	it('should accept null and undefined as valid values', () => {
		const interactionId = 'test-interaction-id';
		const labelStack = [{ name: 'test-segment' }];

		// Create a new interaction
		addNewInteraction(
			interactionId,
			'test-ufo-name',
			'page_load',
			performance.now(),
			1.0,
			labelStack,
		);

		addCohortingCustomData(interactionId, 'nullKey', null);
		addCohortingCustomData(interactionId, 'undefinedKey', undefined);

		const interaction = interactions.get(interactionId);
		expect(interaction!.cohortingCustomData.get('nullKey')).toBeNull();
		expect(interaction!.cohortingCustomData.get('undefinedKey')).toBeUndefined();
	});
});

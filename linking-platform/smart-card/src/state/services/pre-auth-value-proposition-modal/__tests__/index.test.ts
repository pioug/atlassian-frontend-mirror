import {
	PRE_AUTH_VALUE_PROPOSITION_MODAL_COOLDOWN_MS,
	PRE_AUTH_VALUE_PROPOSITION_MODAL_STORAGE_ITEM_KEY,
	PreAuthValuePropositionModalService,
} from '../index';

const STORAGE_SCOPE = '@atlaskit/smart-card';
const STORAGE_ROW_KEY = `${STORAGE_SCOPE}_${PRE_AUTH_VALUE_PROPOSITION_MODAL_STORAGE_ITEM_KEY}`;
const googleDriveExtensionKey = 'google-object-provider';
const figmaExtensionKey = 'figma-object-provider';
const githubExtensionKey = 'github-object-provider';

const initialShowTime = new Date('2026-09-10T00:00:00.000Z');

describe('PreAuthValuePropositionModalService', () => {
	beforeEach(() => {
		localStorage.clear();
		jest.useFakeTimers();
		jest.setSystemTime(initialShowTime);
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('shows once per provider and blocks every provider during the weekly cooldown', () => {
		const service = new PreAuthValuePropositionModalService();

		expect(service.hasReachedShowLimit(googleDriveExtensionKey)).toBe(false);
		service.recordShow(googleDriveExtensionKey);
		expect(service.hasReachedShowLimit(googleDriveExtensionKey)).toBe(true);
		expect(service.hasReachedShowLimit(figmaExtensionKey)).toBe(true);
		expect(localStorage.getItem(STORAGE_ROW_KEY)).toBe(
			JSON.stringify({
				value: {
					lastShownAt: initialShowTime.getTime(),
					shownExtensionKeys: [googleDriveExtensionKey],
				},
			}),
		);

		expect(new PreAuthValuePropositionModalService().hasReachedShowLimit(figmaExtensionKey)).toBe(
			true,
		);
		expect(
			new PreAuthValuePropositionModalService().hasReachedShowLimit(googleDriveExtensionKey),
		).toBe(true);
	});

	it('shows a new provider after a week and resets the weekly cooldown', () => {
		const service = new PreAuthValuePropositionModalService();
		service.recordShow(googleDriveExtensionKey);

		jest.setSystemTime(
			new Date(initialShowTime.getTime() + PRE_AUTH_VALUE_PROPOSITION_MODAL_COOLDOWN_MS - 1),
		);
		expect(service.hasReachedShowLimit(figmaExtensionKey)).toBe(true);
		expect(service.hasReachedShowLimit(googleDriveExtensionKey)).toBe(true);

		const nextEligibleShowTime = new Date(
			initialShowTime.getTime() + PRE_AUTH_VALUE_PROPOSITION_MODAL_COOLDOWN_MS,
		);
		jest.setSystemTime(nextEligibleShowTime);
		expect(service.hasReachedShowLimit(googleDriveExtensionKey)).toBe(true);
		expect(service.hasReachedShowLimit(figmaExtensionKey)).toBe(false);

		service.recordShow(figmaExtensionKey);
		expect(service.hasReachedShowLimit(githubExtensionKey)).toBe(true);
		expect(localStorage.getItem(STORAGE_ROW_KEY)).toBe(
			JSON.stringify({
				value: {
					lastShownAt: nextEligibleShowTime.getTime(),
					shownExtensionKeys: [googleDriveExtensionKey, figmaExtensionKey],
				},
			}),
		);

		expect(new PreAuthValuePropositionModalService().hasReachedShowLimit(githubExtensionKey)).toBe(
			true,
		);
		expect(new PreAuthValuePropositionModalService().hasReachedShowLimit(figmaExtensionKey)).toBe(
			true,
		);
	});

	it('does not record a repeat provider or a provider shown during the weekly cooldown', () => {
		const service = new PreAuthValuePropositionModalService();
		service.recordShow(googleDriveExtensionKey);
		service.recordShow(googleDriveExtensionKey);
		service.recordShow(figmaExtensionKey);

		expect(localStorage.getItem(STORAGE_ROW_KEY)).toBe(
			JSON.stringify({
				value: {
					lastShownAt: initialShowTime.getTime(),
					shownExtensionKeys: [googleDriveExtensionKey],
				},
			}),
		);
	});

	it('resets in-memory and stored providers', () => {
		const service = new PreAuthValuePropositionModalService();
		service.recordShow(googleDriveExtensionKey);

		service.reset();

		expect(service.hasReachedShowLimit(googleDriveExtensionKey)).toBe(false);
		expect(new PreAuthValuePropositionModalService().hasReachedShowLimit(figmaExtensionKey)).toBe(
			false,
		);
		expect(localStorage.getItem(STORAGE_ROW_KEY)).toBeNull();
	});

	it('fails open when persisted storage cannot be read', () => {
		const getItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('storage blocked');
		});

		expect(
			new PreAuthValuePropositionModalService().hasReachedShowLimit(googleDriveExtensionKey),
		).toBe(false);

		getItem.mockRestore();
	});
});

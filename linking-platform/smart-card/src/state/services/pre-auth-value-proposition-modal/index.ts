import { StorageClient } from '@atlaskit/frontend-utilities/StorageClient';

const SMART_CARD_STORAGE_SCOPE = '@atlaskit/smart-card';

export const PRE_AUTH_VALUE_PROPOSITION_MODAL_STORAGE_ITEM_KEY =
	'pre-auth-value-proposition-modal-shown-providers:v3';

const weekInMs: number = 7 * 24 * 60 * 60 * 1000;
export const PRE_AUTH_VALUE_PROPOSITION_MODAL_COOLDOWN_MS: number = weekInMs;

type StoredShowState = {
	lastShownAt: number;
	shownExtensionKeys: string[];
};

let smartCardStorage: StorageClient | null | undefined;

const getSmartCardStorage = (): StorageClient | null => {
	if (typeof window === 'undefined') {
		return null;
	}

	if (smartCardStorage !== undefined) {
		return smartCardStorage;
	}

	try {
		smartCardStorage = new StorageClient(SMART_CARD_STORAGE_SCOPE);
	} catch {
		smartCardStorage = null;
	}

	return smartCardStorage;
};

const isShownExtensionKeys = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((extensionKey) => typeof extensionKey === 'string');

const isStoredShowState = (value: unknown): value is StoredShowState => {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const storedShowState = value as Partial<StoredShowState>;

	return (
		typeof storedShowState.lastShownAt === 'number' &&
		Number.isFinite(storedShowState.lastShownAt) &&
		isShownExtensionKeys(storedShowState.shownExtensionKeys)
	);
};

const EMPTY_STORED_SHOW_STATE: StoredShowState = {
	lastShownAt: 0,
	shownExtensionKeys: [],
};

export class PreAuthValuePropositionModalService {
	private storedShowState: StoredShowState | null = null;

	hasReachedShowLimit(extensionKey: string): boolean {
		const { lastShownAt, shownExtensionKeys } = this.getStoredShowState();

		if (shownExtensionKeys.includes(extensionKey)) {
			return true;
		}

		return (
			lastShownAt > 0 && Date.now() - lastShownAt < PRE_AUTH_VALUE_PROPOSITION_MODAL_COOLDOWN_MS
		);
	}

	recordShow(extensionKey: string): void {
		if (this.hasReachedShowLimit(extensionKey)) {
			return;
		}

		const { shownExtensionKeys } = this.getStoredShowState();
		const nextStoredShowState: StoredShowState = {
			lastShownAt: Date.now(),
			shownExtensionKeys: [...shownExtensionKeys, extensionKey],
		};
		this.storedShowState = nextStoredShowState;

		try {
			getSmartCardStorage()?.setItemWithExpiry(
				PRE_AUTH_VALUE_PROPOSITION_MODAL_STORAGE_ITEM_KEY,
				nextStoredShowState,
			);
		} catch {
			// Browser Storage Controls, quota, private mode, and SSR must not break the editor.
		}
	}

	reset(): void {
		this.storedShowState = null;

		try {
			getSmartCardStorage()?.removeItem(PRE_AUTH_VALUE_PROPOSITION_MODAL_STORAGE_ITEM_KEY);
		} catch {
			// Browser Storage Controls, quota, private mode, and SSR must not break the editor.
		}
	}

	private getStoredShowState(): StoredShowState {
		if (this.storedShowState !== null) {
			return this.storedShowState;
		}

		const storedShowState = this.readStoredShowState();
		this.storedShowState = storedShowState;
		return storedShowState;
	}

	private readStoredShowState(): StoredShowState {
		try {
			const storedShowState = getSmartCardStorage()?.getItem(
				PRE_AUTH_VALUE_PROPOSITION_MODAL_STORAGE_ITEM_KEY,
			);

			if (!isStoredShowState(storedShowState)) {
				return EMPTY_STORED_SHOW_STATE;
			}

			return storedShowState;
		} catch {
			return EMPTY_STORED_SHOW_STATE;
		}
	}
}

export const preAuthValuePropositionModalService: PreAuthValuePropositionModalService =
	new PreAuthValuePropositionModalService();

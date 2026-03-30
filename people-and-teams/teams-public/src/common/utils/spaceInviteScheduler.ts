/**
 * FE debounce mechanism to avoid spamming invites when users consecutively
 * link and unlink teams from containers in quick succession. We'll log the
 * frequency of this occurring and decide whether to move debouncing to the
 * BE as a productionisation task.
 *
 * Uses module-level state rather than a globalThis singleton to avoid polluting
 * the global scope — a simple in-memory workaround is sufficient here.
 */

const DEBOUNCE_MS = 15_000;

type PendingInvite = {
	timeoutId: ReturnType<typeof setTimeout>;
	callback: () => void;
};

const pending = new Map<string, PendingInvite>();

// Callers pass IDs in different formats — the teams package passes full ARIs
// (e.g. "ari:cloud:identity::team/uuid") while teams-public passes bare IDs
// (e.g. "uuid"). Normalize to just the resource ID after the last "/" so both
// formats produce the same map key.
const extractId = (ari: string): string => {
	const lastSlash = ari.lastIndexOf('/');
	return lastSlash === -1 ? ari : ari.substring(lastSlash + 1);
};

const getKey = (teamId: string, containerId: string): string =>
	`${extractId(teamId)}:${extractId(containerId)}`;

export const spaceInviteScheduler = {
	scheduleInvite: (teamId: string, containerId: string, callback: () => void): void => {
		const key = getKey(teamId, containerId);
		const existing = pending.get(key);
		if (existing) {
			clearTimeout(existing.timeoutId);
		}
		pending.set(key, {
			callback,
			timeoutId: setTimeout(() => {
				pending.delete(key);
				callback();
			}, DEBOUNCE_MS),
		});
	},

	cancelInvite: (teamId: string, containerId: string): void => {
		const key = getKey(teamId, containerId);
		const existing = pending.get(key);
		if (existing) {
			clearTimeout(existing.timeoutId);
			pending.delete(key);
		}
	},

	/**
	 * Immediately fires all pending callbacks and clears the queue.
	 * Called automatically on page unload (visibilitychange / beforeunload)
	 * so that debounced invites are not lost when the user navigates away.
	 *
	 * Important: callbacks invoked during page teardown must use
	 * `fetch({ keepalive: true })` or `navigator.sendBeacon` — a regular
	 * `fetch` without `keepalive` may be cancelled by the browser.
	 */
	flushAll: (): void => {
		pending.forEach((entry) => {
			clearTimeout(entry.timeoutId);
			entry.callback();
		});
		pending.clear();
	},
};

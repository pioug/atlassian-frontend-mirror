import {
	createNativeEmbedCommentSupport,
	noNativeEmbedCommentSupport,
	type NativeEmbedCommentSupport,
} from './comment-support';

/** Runtime capability only: no manifests, editor instances, or persisted document state. */
export class NativeEmbedCommentSupportStore {
	private capabilities = new Map<string, boolean>();
	private snapshot: NativeEmbedCommentSupport = noNativeEmbedCommentSupport;
	private listeners = new Set<() => void>();

	getSnapshot = (): NativeEmbedCommentSupport => this.snapshot;

	subscribe = (listener: () => void): (() => void) => {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	};

	register(experienceId: string, enabled: boolean): void {
		// Match the manifest registry: the first registration for an experience wins.
		if (this.capabilities.has(experienceId)) {
			return;
		}
		this.capabilities.set(experienceId, enabled);
		// Missing and explicitly disabled both resolve to false. Keep the snapshot stable.
		if (enabled) {
			this.snapshot = createNativeEmbedCommentSupport(this.capabilities);
			this.listeners.forEach((listener) => listener());
		}
	}
}

const commentSupportStore = new NativeEmbedCommentSupportStore();

export const getNativeEmbedCommentSupportStore = (): NativeEmbedCommentSupportStore =>
	commentSupportStore;

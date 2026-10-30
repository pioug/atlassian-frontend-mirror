import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { DecorationSet, EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SurfaceDescriptor } from './block-controls-surface-descriptors';

export type SurfaceSnapshot = {
	readonly forceVisibleOnMouseOut: boolean;
	readonly left: readonly SurfaceDescriptor[];
	readonly revision: number;
	readonly right: readonly SurfaceDescriptor[];
};

const filterAvailable = (
	descriptors: readonly SurfaceDescriptor[],
	available: ReadonlySet<string>,
): readonly SurfaceDescriptor[] =>
	descriptors.every((descriptor) => available.has(descriptor.anchorName))
		? descriptors
		: descriptors.filter((descriptor) => available.has(descriptor.anchorName));

const areSameDescriptors = (
	a: readonly SurfaceDescriptor[],
	b: readonly SurfaceDescriptor[],
): boolean => a.length === b.length && a.every((descriptor, index) => descriptor === b[index]);

/**
 * Keeps anchor decorations in step with the block-control surfaces React renders.
 * - An anchor stays until React has committed a tree that no longer uses it.
 * - Surfaces whose anchor is gone (deleted block, drag, limited mode) are left out of the snapshot,
 *   so React removes them before the browser paints.
 */
export class SurfaceLifecycle {
	private published: SurfaceSnapshot | undefined;
	private snapshot: SurfaceSnapshot | undefined;
	private committedRevision = 0;
	private revision = 0;
	private lastUsedRevision = new Map<string, number>();
	private listeners = new Set<() => void>();
	private availableAnchors: ReadonlySet<string> = new Set();
	private publishedAnchors = new Set<string>();
	private decorations: DecorationSet | undefined;
	private suppressed = false;
	private onCommit: (() => void) | undefined;

	getSnapshot = (): SurfaceSnapshot | undefined => this.snapshot;

	subscribe = (listener: () => void): (() => void) => {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	};

	setOnCommit(onCommit: () => void): void {
		this.onCommit = onCommit;
	}

	publish(snapshot: Omit<SurfaceSnapshot, 'revision'>, anchors: ReadonlyMap<number, string>): void {
		if (
			this.published?.left === snapshot.left &&
			this.published.right === snapshot.right &&
			this.published.forceVisibleOnMouseOut === snapshot.forceVisibleOnMouseOut &&
			this.publishedAnchors.size === anchors.size &&
			[...anchors.values()].every((name) => this.publishedAnchors.has(name))
		) {
			return;
		}
		this.publishedAnchors = new Set(anchors.values());
		const revision = ++this.revision;
		for (const name of anchors.values()) {
			this.lastUsedRevision.set(name, revision);
		}
		this.published = { ...snapshot, revision };
		this.updateSnapshot(true);
	}

	acknowledge = (revision: number): void => {
		if (revision <= this.committedRevision || revision > (this.published?.revision ?? 0)) {
			return;
		}
		this.committedRevision = revision;
		this.onCommit?.();
	};

	retainAnchors(doc: PMNode, desired: DecorationSet, previous: DecorationSet): DecorationSet {
		const positions = new Set(desired.find().map((decoration) => decoration.from));
		const retained = previous
			.find()
			.filter(
				(decoration) =>
					!positions.has(decoration.from) && this.isRetained(decoration.spec.anchorName),
			);
		return retained.length ? desired.add(doc, retained) : desired;
	}

	/** Whether a reconcile would drop anchors that no committed or pending tree still uses. */
	hasRetirableAnchors(decorations: DecorationSet): boolean {
		return decorations.find().some((decoration) => !this.isRetained(decoration.spec.anchorName));
	}

	private isRetained(name: string): boolean {
		const revision = this.lastUsedRevision.get(name);
		// Keep the committed tree and every newer published tree until a later commit replaces them.
		return revision !== undefined && revision >= this.committedRevision;
	}

	/**
	 * Records which anchors the browser can currently resolve. Removes surfaces for missing or
	 * suppressed anchors from the snapshot synchronously, ahead of the next reconcile.
	 */
	updateAnchors(decorations: DecorationSet, suppressed: boolean): void {
		if (decorations === this.decorations && suppressed === this.suppressed) {
			return;
		}
		this.decorations = decorations;
		this.suppressed = suppressed;
		const names = new Set<string>(
			decorations.find().map((decoration) => decoration.spec.anchorName),
		);
		this.availableAnchors = suppressed ? new Set() : names;
		for (const name of this.lastUsedRevision.keys()) {
			if (!names.has(name)) {
				this.lastUsedRevision.delete(name);
			}
		}
		this.updateSnapshot(false);
	}

	/** Derives the snapshot React reads, replacing it only when the rendered surfaces change. */
	private updateSnapshot(published: boolean): void {
		if (!this.published) {
			return;
		}
		const left = filterAvailable(this.published.left, this.availableAnchors);
		const right = filterAvailable(this.published.right, this.availableAnchors);
		if (
			!published &&
			this.snapshot &&
			areSameDescriptors(left, this.snapshot.left) &&
			areSameDescriptors(right, this.snapshot.right)
		) {
			return;
		}
		this.snapshot = { ...this.published, left, right };
		this.listeners.forEach((listener) => listener());
	}

	destroy(): void {
		this.availableAnchors = new Set();
		this.publishedAnchors.clear();
		this.lastUsedRevision.clear();
		this.onCommit = undefined;
		this.decorations = undefined;
		this.published = undefined;
		this.snapshot = undefined;
		this.listeners.forEach((listener) => listener());
	}
}

const lifecycles = new WeakMap<EditorView, SurfaceLifecycle>();

export const getSurfaceLifecycle = (view: EditorView): SurfaceLifecycle => {
	let lifecycle = lifecycles.get(view);
	if (!lifecycle) {
		lifecycle = new SurfaceLifecycle();
		lifecycles.set(view, lifecycle);
	}
	return lifecycle;
};

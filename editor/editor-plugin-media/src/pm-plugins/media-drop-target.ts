import { GapCursorSelection } from '@atlaskit/editor-common/selection/gap-cursor/selection';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { EditorState, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { Mapping } from '@atlaskit/editor-prosemirror/transform';
import { dropPoint } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { MediaOptions } from '../types';
import { getMediaNodeInsertionType } from './utils/media-inline';

/** Keeps a media insertion point collapsed so a drop never replaces the current selection. */
export const mediaDropSelection = (doc: PMNode, pos: number): Selection => {
	const $pos = doc.resolve(pos);
	return $pos.parent.inlineContent ? TextSelection.create(doc, pos) : new GapCursorSelection($pos);
};

export const findMediaDropPosition = (
	view: EditorView,
	coords: { left: number; top: number },
	fileTypes: string[],
	mediaOptions?: MediaOptions,
): number | undefined => {
	if (!view.editable || view.dragging || fileTypes.length === 0) {
		return;
	}

	const rect = view.dom.getBoundingClientRect();
	const hit = view.posAtCoords({
		left: Math.max(rect.left + 1, Math.min(coords.left, rect.right - 1)),
		top: Math.max(rect.top + 1, Math.min(coords.top, rect.bottom - 1)),
	});
	if (!hit) {
		return;
	}

	const { doc, schema } = view.state;
	const targetState = EditorState.create({
		doc,
		schema,
		selection: mediaDropSelection(doc, hit.pos),
	});
	const supportedOptions = schema.nodes.mediaInline
		? mediaOptions
		: { ...mediaOptions, featureFlags: { ...mediaOptions?.featureFlags, mediaInline: false } };
	const insertionTypes = new Set(
		Array.from(new Set(fileTypes), (fileType) =>
			getMediaNodeInsertionType(targetState, supportedOptions, fileType),
		),
	);
	const slices = Array.from(insertionTypes).flatMap((insertionType) => {
		let node: PMNode;
		if (insertionType === 'inline') {
			node = schema.nodes.mediaInline.create();
		} else {
			const container =
				insertionType === 'block' ? schema.nodes.mediaSingle : schema.nodes.mediaGroup;
			if (!container || !schema.nodes.media) {
				return [];
			}
			node = container.create(null, schema.nodes.media.create({ type: 'file' }));
		}
		return new Slice(Fragment.from(node), 0, 0);
	});

	if (slices.length !== insertionTypes.size) {
		return;
	}
	for (const slice of slices) {
		const pos = dropPoint(doc, hit.pos, slice);
		if (
			pos !== null &&
			slices.every((content) => {
				const alreadyValidated = content === slice && pos === hit.pos;
				return alreadyValidated || dropPoint(doc, pos, content) === pos;
			})
		) {
			return pos;
		}
	}
	return;
};

export type MediaDropReplacement = {
	media: PMNode;
	pos: number;
};

/** Only a single image over a media card can replace it; captions and surrounding space insert. */
export const findMediaDropReplacement = (
	view: EditorView,
	event: DragEvent,
	fileTypes: string[],
): MediaDropReplacement | undefined => {
	if (
		!view.editable ||
		view.dragging ||
		fileTypes.length !== 1 ||
		!fileTypes[0].startsWith('image/')
	) {
		return;
	}
	if (!(event.target instanceof Element)) {
		return;
	}
	const mediaDom = event.target.closest(
		'[data-prosemirror-node-name="media"], [data-node-type="media"]',
	);
	if (!mediaDom || !view.dom.contains(mediaDom)) {
		return;
	}
	const card = mediaDom.querySelector('.media-card-wrapper') ?? mediaDom;
	const rect = card.getBoundingClientRect();
	if (
		event.clientX < rect.left ||
		event.clientX >= rect.right ||
		event.clientY < rect.top ||
		event.clientY >= rect.bottom
	) {
		return;
	}
	const $pos = view.state.doc.resolve(view.posAtDOM(mediaDom, 0));
	if ($pos.parent.type !== view.state.schema.nodes.mediaSingle) {
		return;
	}
	const media = $pos.parent.firstChild;
	if (!media || media.type !== view.state.schema.nodes.media) {
		return;
	}
	const mimeType: string | undefined = media.attrs.__fileMimeType;
	const hasImagePreview =
		!!card.querySelector(
			'img[data-fileid], img[data-testid="media-image"], img[data-testid="media-card-svg"]',
		) && !card.querySelector('video, [data-testid="media-card-play-button-wrapper"]');
	const isImage = mimeType
		? mimeType.startsWith('image/')
		: media.attrs.type === 'external' || hasImagePreview;
	return isImage ? { pos: $pos.before(), media } : undefined;
};

const mapReplacement = (
	replacement: MediaDropReplacement | undefined,
	mapping: Mapping,
): MediaDropReplacement | undefined => {
	if (!replacement) {
		return;
	}
	const mapped = mapping.mapResult(replacement.pos, 1);
	return mapped.deleted ? undefined : { ...replacement, pos: mapped.pos };
};

const currentReplacement = (
	replacement: MediaDropReplacement | undefined,
	doc: PMNode,
): MediaDropReplacement | undefined => {
	if (!replacement) {
		return;
	}
	const node = doc.nodeAt(replacement.pos);
	const media = node?.firstChild;
	const original = replacement.media;
	if (
		node?.type.name === 'mediaSingle' &&
		media?.type === original.type &&
		media.attrs.id === original.attrs.id &&
		media.attrs.collection === original.attrs.collection &&
		media.attrs.type === original.attrs.type &&
		media.attrs.url === original.attrs.url
	) {
		return replacement;
	}
	return;
};

type DropBatch = {
	files: Set<string>;
	pos: number;
	prepared: boolean;
	replacement?: MediaDropReplacement;
};

/** Retains drop locations while uploads prepare and other edits change document positions. */
export class MediaDropTargets {
	hover?: number;
	hoverReplacement?: MediaDropReplacement;
	private batches = new Map<string, DropBatch>();
	private files = new Map<string, DropBatch>();

	start(traceId: string, pos: number, replacement?: MediaDropReplacement): () => void {
		const batch: DropBatch = { pos, replacement, files: new Set(), prepared: false };
		this.batches.set(traceId, batch);
		return () => {
			batch.prepared = true;
			this.prune();
		};
	}

	register(traceId: string, fileIds: string[]): void {
		const batch = this.batches.get(traceId);
		if (!batch) {
			return;
		}
		for (const id of fileIds) {
			batch.files.add(id);
			this.files.set(id, batch);
		}
	}

	positionFor(fileId: string): number | undefined {
		return this.files.get(fileId)?.pos;
	}

	replacementFor(fileId: string, doc: PMNode): MediaDropReplacement | undefined {
		return currentReplacement(this.files.get(fileId)?.replacement, doc);
	}

	hoverReplacementFor(doc: PMNode): MediaDropReplacement | undefined {
		return currentReplacement(this.hoverReplacement, doc);
	}

	clearHover(): void {
		this.hover = undefined;
		this.hoverReplacement = undefined;
	}

	inserted(fileId: string): void {
		this.files.get(fileId)?.files.delete(fileId);
		this.files.delete(fileId);
		this.prune();
	}

	map(mapping: Mapping): void {
		if (mapping.maps.length === 0) {
			return;
		}
		if (this.hover !== undefined) {
			this.hover = mapping.map(this.hover, 1);
		}
		this.hoverReplacement = mapReplacement(this.hoverReplacement, mapping);
		for (const batch of this.batches.values()) {
			batch.pos = mapping.map(batch.pos, 1);
			batch.replacement = mapReplacement(batch.replacement, mapping);
		}
	}

	clear(): void {
		this.clearHover();
		this.batches.clear();
		this.files.clear();
	}

	private prune(): void {
		for (const [id, batch] of this.batches) {
			if (batch.prepared && batch.files.size === 0) {
				this.batches.delete(id);
			}
		}
	}
}

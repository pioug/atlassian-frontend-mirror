import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

function getOfflineSteps(
	steps: readonly ProseMirrorStep[] | undefined,
	origins: readonly Transaction[] | undefined,
): readonly ProseMirrorStep[] | undefined {
	if (!steps || !origins || steps.length !== origins.length) {
		return undefined;
	}
	if (origins.some((s) => s?.getMeta('isOffline') === true || s?.getMeta('wasOffline') === true)) {
		const mapped = steps.filter((step, idx) => {
			const origin = origins[idx];
			if (!origin) {
				return false;
			}
			const createdOffline = origin.getMeta('isOffline') || origin.getMeta('wasOffline');
			return createdOffline;
		});
		return mapped;
	}
}

export function getOfflineStepsLength(
	steps: readonly ProseMirrorStep[] | undefined,
	origins: readonly Transaction[] | undefined,
): number | undefined {
	return getOfflineSteps(steps, origins)?.length;
}

export function getOfflineReplaceStepsLength(
	steps: readonly ProseMirrorStep[] | undefined,
	origins: readonly Transaction[] | undefined,
): number | undefined {
	return getOfflineSteps(steps, origins)?.filter((s) => s instanceof ReplaceStep).length;
}

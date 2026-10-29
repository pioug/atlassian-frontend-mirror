import { isOpenLayerTakingEscape } from './is-open-layer-taking-escape';

/**
 * The open layers inside `within` that take Escape (see `isOpenLayerTakingEscape`), not `within`
 * itself. Shadow roots are not searched (ADS does not use them).
 */
export function getOpenLayersTakingEscape({ within }: { within: ParentNode }): HTMLElement[] {
	return Array.from(within.querySelectorAll<HTMLElement>('dialog, [popover]')).filter((element) =>
		isOpenLayerTakingEscape({ element }),
	);
}

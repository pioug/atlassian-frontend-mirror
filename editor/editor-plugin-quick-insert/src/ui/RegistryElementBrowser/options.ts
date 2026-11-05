/** Whether a rendered result tile can't be selected. */
export const isOptionDisabled = (option: Element): boolean =>
	option.hasAttribute('disabled') || option.getAttribute('aria-disabled') === 'true';

/** The first result tile in `container` that can be selected. */
export const getFirstEnabledOption = (
	container: ParentNode | null | undefined,
): HTMLElement | undefined =>
	Array.from(container?.querySelectorAll<HTMLElement>('[role="option"]') ?? []).find(
		(option) => !isOptionDisabled(option),
	);

/** Whether a rendered result tile can't be selected. */
export const isOptionDisabled = (option: Element): boolean =>
	option.hasAttribute('disabled') || option.getAttribute('aria-disabled') === 'true';

export const getOptions = (container: ParentNode | null): HTMLElement[] =>
	Array.from(container?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);

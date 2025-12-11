export function isElementVisible(element: Element): boolean {
	if (!(element instanceof HTMLElement)) {
		return true;
	}

	try {
		const visible = element.checkVisibility({
			// @ts-ignore - visibilityProperty may not exist in all TS environments
			visibilityProperty: true,
			contentVisibilityAuto: true,
			opacityProperty: true,
		});

		return visible;
	} catch {
		// there is no support for checkVisibility
		return true;
	}
}

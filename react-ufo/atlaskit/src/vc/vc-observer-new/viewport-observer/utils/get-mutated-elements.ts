import { fg } from '@atlaskit/platform-feature-flags';

type MutatedElement = {
	isDisplayContentsElementChildren: boolean;
	element: Element;
};

const MAX_NESTED_LEVELS_OF_DISPLAY_CONTENT_ELEMENTS_HANDLED = 3;
export function getMutatedElements(element: Element, depthLevel = 0): MutatedElement[] {
	if (fg('platform_ufo_disable_vcnext_observations')) {
		return [{ element, isDisplayContentsElementChildren: false }];
	}

	if (window?.getComputedStyle(element)?.display === 'contents') {
		const mutatedElements: MutatedElement[] = [];
		const nestedDisplayContentsElementChildren: Element[] = [];
		for (const child of element.children) {
			if (window?.getComputedStyle(child)?.display === 'contents') {
				nestedDisplayContentsElementChildren.push(child);
			}

			mutatedElements.push({
				element: child,
				isDisplayContentsElementChildren: true,
			});
		}

		if (
			depthLevel < MAX_NESTED_LEVELS_OF_DISPLAY_CONTENT_ELEMENTS_HANDLED &&
			nestedDisplayContentsElementChildren.length > 0
		) {
			return [
				...mutatedElements,
				...nestedDisplayContentsElementChildren
					.map((element) => getMutatedElements(element, depthLevel + 1))
					.flat(),
			];
		}

		return mutatedElements;
	} else {
		return [{ element, isDisplayContentsElementChildren: false }];
	}
}

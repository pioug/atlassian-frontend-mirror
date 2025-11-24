import { fg } from '@atlaskit/platform-feature-flags';

type MutatedElement = {
	isDisplayContentsElementChildren: boolean;
	element: Element;
};

function isElementStyledWithDisplayContents(element: Element) {
	// To minimise calling `getComputedStyle`, we are making an assumption that if an element is from the Entrypoints framework, then it will have `display: contents` styling
	// as per https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/e4ccf437262ef4c0fd3c651ffb7ad4770b15aed4/jira/src/packages/platform/entry-points/entry-point-placeholder/src/index.tsx#lines-136
	if (fg('platform_ufo_detect_entrypoint_parent')) {
		if (element.hasAttribute('data-ep-placeholder-id')) {
			return true;
		}

		return window?.getComputedStyle(element)?.display === 'contents';
	}

	return window?.getComputedStyle(element)?.display === 'contents';
}

const MAX_NESTED_LEVELS_OF_DISPLAY_CONTENT_ELEMENTS_HANDLED = 3;
export function getMutatedElements(element: Element, depthLevel = 0): MutatedElement[] {
	if (fg('platform_ufo_disable_vcnext_observations')) {
		return [{ element, isDisplayContentsElementChildren: false }];
	}

	if (isElementStyledWithDisplayContents(element)) {
		const mutatedElements: MutatedElement[] = [];
		const nestedDisplayContentsElementChildren: Element[] = [];
		for (const child of element.children) {
			if (isElementStyledWithDisplayContents(child)) {
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

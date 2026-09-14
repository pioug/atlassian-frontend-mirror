import { resizerItemClassName } from '@atlaskit/editor-common/styles';

const INNER_CONTAINER_SELECTORS: Partial<Record<string, string>> = {
	blockCard: '.datasourceView-content-inner-wrap',
	bodiedExtension: '.extension-container[data-layout]',
	embedCard: '.rich-media-item',
	extension: '.extension-container[data-layout]',
	mediaSingle: `.${resizerItemClassName}`,
	multiBodiedExtension: '.extension-container[data-layout]',
	table: `.${resizerItemClassName}`,
};

export const hasInnerContentContainer = (nodeType: string): boolean =>
	INNER_CONTAINER_SELECTORS[nodeType] !== undefined;

export const getNodeContentElement = (nodeElement: HTMLElement, nodeType: string): HTMLElement => {
	const selector = INNER_CONTAINER_SELECTORS[nodeType];
	if (!selector) {
		return nodeElement;
	}

	return nodeElement.querySelector<HTMLElement>(selector) ?? nodeElement;
};

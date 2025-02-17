import { browser } from '@atlaskit/editor-common/browser';
import { fg } from '@atlaskit/platform-feature-flags';
import { B200, N20, N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const previewStyleNew = {
	borderColor: token('color.border', N30),
	borderStyle: 'solid',
	borderRadius: token('border.radius.100', '3px'),
	borderWidth: token('border.width.outline', '2px'),
	backgroundColor: token('color.skeleton.subtle', N20),
};

const previewStyleOld = {
	borderColor: token('color.border.focused', B200),
	borderStyle: 'solid',
	borderRadius: token('border.radius.100', '3px'),
	borderWidth: token('border.width.outline', '2px'),
	backgroundColor: token('color.blanket.selected', '#388BFF14'),
};

export type DragPreviewContent = {
	dom: HTMLElement;
	nodeType: string;
	nodeSpacing?: { top: string; bottom: string };
};

const getPreviewContainerDimensionsForSingle = (dom: HTMLElement, nodeType: string) => {
	let nodeContainer = dom;
	if (fg('platform_editor_elements_drag_and_drop_ed_23189')) {
		const iframeContainer = dom.querySelector('iframe');
		if (nodeType === 'embedCard') {
			nodeContainer = dom.querySelector('.rich-media-item') || dom;
		} else if (nodeType === 'extension' && iframeContainer) {
			nodeContainer = iframeContainer;
		}
	}
	const nodeContainerRect = nodeContainer.getBoundingClientRect();
	return {
		width: nodeContainerRect.width,
		height: nodeContainerRect.height,
	};
};

const getPreviewContainerDimensions = (dragPreviewContent: DragPreviewContent[]) => {
	let maxWidth = 0;
	let heightSum = 0;
	for (let index = 0; index < dragPreviewContent.length; index++) {
		const element = dragPreviewContent[index];
		const { width, height } = getPreviewContainerDimensionsForSingle(element.dom, element.nodeType);
		if (width > maxWidth) {
			maxWidth = width;
		}
		heightSum += height;
	}
	return {
		width: maxWidth,
		height: heightSum,
	};
};

const createGenericPreview = () => {
	const generalPreview = document.createElement('div');
	// ProseMirror class is required to make sure the cloned dom is styled correctly
	generalPreview.classList.add('ProseMirror', 'block-ctrl-drag-preview');

	const previewStyle = fg('platform_editor_elements_drag_and_drop_ed_23189')
		? previewStyleNew
		: previewStyleOld;

	generalPreview.style.border = `${previewStyle.borderWidth} ${previewStyle.borderStyle} ${previewStyle.borderColor}`;
	generalPreview.style.borderRadius = previewStyle.borderRadius;
	generalPreview.style.backgroundColor = previewStyle.backgroundColor;
	generalPreview.style.height = '100%';
	generalPreview.setAttribute('data-testid', 'block-ctrl-generic-drag-preview');
	return generalPreview;
};

const createContentPreviewElement = (
	dom: HTMLElement,
	nodeType: string,
	nodeSpacing?: { top: string; bottom: string },
) => {
	const contentPreviewOneElement = document.createElement('div');
	contentPreviewOneElement.classList.add('ProseMirror', 'block-ctrl-drag-preview');
	const resizer: HTMLElement | null = dom.querySelector('.resizer-item');
	const clonedDom =
		resizer && ['mediaSingle', 'table'].includes(nodeType)
			? // Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				(resizer.cloneNode(true) as HTMLElement)
			: // Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				(dom.cloneNode(true) as HTMLElement);

	clonedDom.style.marginLeft = '0';
	clonedDom.style.marginTop = nodeSpacing ? `${nodeSpacing.top}` : '0';
	clonedDom.style.marginRight = '0';
	clonedDom.style.marginBottom = nodeSpacing ? `${nodeSpacing.bottom}` : '0';
	clonedDom.style.boxShadow = 'none';
	clonedDom.style.opacity = browser.windows
		? '1'
		: fg('platform_editor_elements_drag_and_drop_ed_23189')
			? '0.31'
			: '0.4';

	contentPreviewOneElement.appendChild(clonedDom);
	return contentPreviewOneElement;
};

const isGenericPreview = (dom: HTMLElement, nodeType: string) => {
	const embedCard: HTMLElement | null = dom.querySelector('.embedCardView-content-wrap');
	return fg('platform_editor_elements_drag_and_drop_ed_23189')
		? nodeType === 'embedCard' ||
				!!embedCard ||
				(nodeType === 'extension' && !!dom.querySelector('iframe'))
		: nodeType === 'embedCard' || !!embedCard || nodeType === 'extension';
};

const createPreviewForElement = (
	dom: HTMLElement,
	nodeType: string,
	nodeSpacing?: { top: string; bottom: string },
) => {
	const shouldBeGenericPreview = isGenericPreview(dom, nodeType);
	if (shouldBeGenericPreview) {
		return createGenericPreview();
	} else {
		return createContentPreviewElement(dom, nodeType, nodeSpacing);
	}
};

export const dragPreview = (
	container: HTMLElement,
	dragPreviewContent: DragPreviewContent | DragPreviewContent[],
) => {
	container.style.pointerEvents = 'none';
	if (!Array.isArray(dragPreviewContent) && typeof dragPreviewContent === 'object') {
		dragPreviewContent = [dragPreviewContent];
	}
	const { width: maxWidth, height: maxHeight } = getPreviewContainerDimensions(dragPreviewContent);
	container.style.width = `${maxWidth}px`;
	container.style.height = `${maxHeight}px`;

	const previewWrapperFragment = document.createDocumentFragment();
	for (let index = 0; index < dragPreviewContent.length; index++) {
		const element = dragPreviewContent[index];
		const contentPreviewOneElement = createPreviewForElement(
			element.dom,
			element.nodeType,
			element.nodeSpacing,
		);
		previewWrapperFragment.appendChild(contentPreviewOneElement);
	}
	container.appendChild(previewWrapperFragment);
	const scrollParent = document.querySelector('.fabric-editor-popup-scroll-parent');
	const scrollParentClassNames = scrollParent?.className;
	// Add the scroll parent class to the container to ensure the cloned element is styled correctly
	container.className = scrollParentClassNames || '';
	container.classList.remove('fabric-editor-popup-scroll-parent');
	// Prevents a scrollbar from showing
	container.style.overflow = 'visible';

	return () => container;
};

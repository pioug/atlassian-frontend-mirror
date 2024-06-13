import { token } from '@atlaskit/tokens';

//
const previewStyle = {
	borderColor: token('color.border.focused'),
	borderStyle: 'solid',
	borderRadius: token('border.radius.100'),
	borderWidth: token('border.width.outline'),
	backgroundColor: token('color.blanket.selected'),
};

export const dragPreview = (container: HTMLElement, dom: HTMLElement, nodeType: string) => {
	const rect = dom.getBoundingClientRect();
	container.style.width = `${rect.width}px`;
	container.style.height = `${rect.height}px`;
	container.style.pointerEvents = 'none';
	const parent = document.createElement('div');
	// ProseMirror class is required to make sure the cloned dom is styled correctly
	parent.classList.add('ProseMirror');

	const shouldBeGenericPreview = nodeType === 'embedCard' || nodeType === 'extension';

	if (shouldBeGenericPreview) {
		parent.style.border = `${previewStyle.borderWidth} ${previewStyle.borderStyle} ${previewStyle.borderColor}`;
		parent.style.borderRadius = previewStyle.borderRadius;
		parent.style.backgroundColor = previewStyle.backgroundColor;
		parent.style.height = '100%';
		parent.setAttribute('data-testid', 'block-ctrl-generic-drag-preview');
	}
	const resizer: HTMLElement | null = dom.querySelector('.resizer-item');
	const clonedDom = resizer
		? (resizer.cloneNode(true) as HTMLElement)
		: (dom.cloneNode(!shouldBeGenericPreview) as HTMLElement);

	// Remove any margin from the cloned element to ensure is doesn't position incorrectly
	clonedDom.style.marginLeft = '0';
	clonedDom.style.marginTop = '0';
	clonedDom.style.marginRight = '0';
	clonedDom.style.marginBottom = '0';
	clonedDom.style.opacity = '0.4';

	parent.appendChild(clonedDom);
	container.appendChild(parent);

	const scrollParent = document.querySelector('.fabric-editor-popup-scroll-parent');
	const scrollParentClassNames = scrollParent?.className;

	// Add the scroll parent class to the container to ensure the cloned element is styled correctly
	container.className = scrollParentClassNames || '';
	container.classList.remove('fabric-editor-popup-scroll-parent');
	// Prevents a scrollbar from showing
	container.style.overflow = 'visible';

	return () => container;
};

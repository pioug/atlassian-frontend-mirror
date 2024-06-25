import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const previewStyle = {
	borderColor: token('color.border.focused', B200),
	borderStyle: 'solid',
	borderRadius: token('border.radius.100', '3px'),
	borderWidth: token('border.width.outline', '2px'),
	backgroundColor: token('color.blanket.selected', '#388BFF14'),
};

export const dragPreview = (container: HTMLElement, dom: HTMLElement, nodeType: string) => {
	const rect = dom.getBoundingClientRect();
	container.style.width = `${rect.width}px`;
	container.style.height = `${rect.height}px`;
	container.style.pointerEvents = 'none';
	const parent = document.createElement('div');
	// ProseMirror class is required to make sure the cloned dom is styled correctly
	parent.classList.add('ProseMirror');
	if (getBooleanFF('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2')) {
		parent.classList.add('block-ctrl-drag-preview');
	}

	const shouldBeGenericPreview = nodeType === 'embedCard' || nodeType === 'extension';
	const embedCard: HTMLElement | null = dom.querySelector('.embedCardView-content-wrap');

	if (shouldBeGenericPreview || embedCard) {
		parent.style.border = `${previewStyle.borderWidth} ${previewStyle.borderStyle} ${previewStyle.borderColor}`;
		parent.style.borderRadius = previewStyle.borderRadius;
		parent.style.backgroundColor = previewStyle.backgroundColor;
		parent.style.height = '100%';
		parent.setAttribute('data-testid', 'block-ctrl-generic-drag-preview');
	} else {
		const resizer: HTMLElement | null = dom.querySelector('.resizer-item');
		const clonedDom =
			resizer && ['mediaSingle', 'table'].includes(nodeType)
				? (resizer.cloneNode(true) as HTMLElement)
				: (dom.cloneNode(true) as HTMLElement);

		// Remove any margin from the cloned element to ensure is doesn't position incorrectly
		clonedDom.style.marginLeft = '0';
		clonedDom.style.marginTop = '0';
		clonedDom.style.marginRight = '0';
		clonedDom.style.marginBottom = '0';
		clonedDom.style.opacity = '0.4';
		clonedDom.style.boxShadow = 'none';
		parent.appendChild(clonedDom);
	}
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

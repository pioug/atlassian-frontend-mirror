export const dragPreview = (
  container: HTMLElement,
  domRef: React.MutableRefObject<HTMLElement>,
) => {
  const rect = domRef.current.getBoundingClientRect();
  container.style.width = `${rect.width}px`;
  container.style.height = `${rect.height}px`;
  container.style.pointerEvents = 'none';
  const parent = document.createElement('div');
  // ProseMirror class is required to make sure the cloned dom is styled correctly
  parent.classList.add('ProseMirror');

  const resizer: HTMLElement | null =
    domRef.current.querySelector('.resizer-item');
  const clonedDom = resizer
    ? (resizer.cloneNode(true) as HTMLElement)
    : (domRef.current.cloneNode(true) as HTMLElement);

  // Remove any margin from the cloned element to ensure is doesn't position incorrectly
  clonedDom.style.marginLeft = '0';
  clonedDom.style.marginTop = '0';
  clonedDom.style.marginRight = '0';
  clonedDom.style.marginBottom = '0';

  parent.appendChild(clonedDom);
  container.appendChild(parent);
  const scrollParent = document.querySelector(
    '.fabric-editor-popup-scroll-parent',
  );
  const scrollParentClassNames = scrollParent?.className;

  // Add the scroll parent class to the container to ensure the cloned element is styled correctly
  container.className = scrollParentClassNames || '';
  container.classList.remove('fabric-editor-popup-scroll-parent');
  // Prevents a scrollbar from showing
  container.style.overflow = 'visible';

  return () => container;
};

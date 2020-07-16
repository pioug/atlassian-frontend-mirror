/**
 * A click handler factory for `NodeViews`. This prevents the parent node
 * from being selected when a user drags/releases their mouse near the border
 * of a node during content selection.
 *
 * Note: You will likely need to call this in the `NodeView` constructor, to
 * have a valid `this.dom` reference at creation time.
 *
 * ```
 * this.handleClick = createSelectionAwareClickHandler(this.dom, this.handleClick).handler;
 * ```
 */
export const createSelectionAwareClickHandler = (
  dom: HTMLElement,
  cb: (event: Event) => void,
) => {
  let selecting = false;

  const handleMouseMove = () => {
    selecting = true;
  };

  const handleMouseUp = () => {
    requestAnimationFrame(() => {
      selecting = false;
    });

    dom.removeEventListener('mousemove', handleMouseMove);
    dom.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    dom.addEventListener('mousemove', handleMouseMove);
    dom.addEventListener('mouseup', handleMouseUp);
  };

  dom.addEventListener('mousedown', handleMouseDown);

  return {
    handler: (event: Event) => !selecting && cb(event),
    cleanup: () => dom.removeEventListener('mousedown', handleMouseDown),
  };
};

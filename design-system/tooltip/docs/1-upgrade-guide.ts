import { md } from '@atlaskit/docs';

export default md`
  ### Breaking Changes in \`11.0.0\`

  11.0.0 focuses on refactoring some of our callback methods to be more useful
  to consumers. Both \`onMouseOver\` and \`onMouseOut\` were being called
  multiple times due to bubbling events from children of the single child component.
  An example of this is that a tooltip wrapping button could have \`onMouseOver\`
  called up to three times while the mouse traversed the button, despite having
  the correct display logic.

  We are replacing these with two new props that aim to perform the goal of the
  previous methods (finding out when the tooltip would be displayed or hidden),
  by instead giving callbacks in the actual show/hide functions within tooltip.

  By moving these out of being linked to DOM state, it will be much easier to
  respond to the actual state changes of tooltip.

  The new props are:

  \`onMouseOver\` --> \`onShow\`
  \`onMouseOut\` --> \`onHide\`

  For the most part, these should be a 1 to 1 translation, with the major difference
  being since these are not tied to a mouse event, so the function has no arguments.

  ### Fixes in \`7.0.0\`

  We have completely rewritten the logic for positioning tooltips, which now
  use our \`layer-manager\` component and portals to render above all other DOM
  elements on the page.

  This means that previous issues where tooltips are clipped by other UI should
  be comprehensively fixed; it also means we're not depending on Popper.js,
  which dramatically improves package weight and performance.

  ### Breaking Changes in \`7.0.0\`

  #### Stateless version removed

  Tooltip previously exported both the \`Tooltip\` component, and a stateless
  version as a named export \`TooltipStateless\`. The stateless version has been
  removed as of version \`7.0.0\`.

  #### Changes to Props

  - \`description\` has been renamed to \`content\`

  In \`7.0.0\` the old props are still supported for backwards-compatibility,
  but will log a deprecation warning. Support will be removed from version
  \`8.0.0\` onwards.
`;

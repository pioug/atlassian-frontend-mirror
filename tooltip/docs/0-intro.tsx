import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  This package exports \`Tooltip\` and \`TooltipPrimitive\` components.

  You can wrap \`Tooltip\` around any other React component to display the given
  \`content\` when the user hovers over the wrapped component.

  You can extend \`TooltipPrimitive\` to create a custom tooltip. It is
  a component with basic styles required by the tooltip. You can then pass this
  custom tooltip in \`component\` prop to display it when user hovers over wrapper
  content of \`Tooltip\`.

  ## Usage

  ${code`import Tooltip, { TooltipPrimitive } from '@atlaskit/tooltip';`}

  ${(
    <Example
      packageName="@atlaskit/tooltip"
      Component={require('../examples/defaultTooltip').default}
      source={require('!!raw-loader!../examples/defaultTooltip')}
      title="Default Tooltip"
    />
  )}

  Above is a basic example of how to use tooltip.

  ${(
    <Example
      packageName="@atlaskit/tooltip"
      Component={require('../examples/position').default}
      source={require('!!raw-loader!../examples/position')}
      title="Position"
      componentProps={{ test: true }}
    />
  )}

  Tooltips have four standard positions available; "top", "right", "bottom", and "left".
  Each standard position center-aligns itself along the appropriate axis and appears outside the target element.

  A "mouse" position is also available that displays the tooltip relative to the mouse rather than the target. Click the target
  above to see each position.

  ${(
    <Example
      packageName="@atlaskit/tooltip"
      Component={require('../examples/hover-intent').default}
      source={require('!!raw-loader!../examples/hover-intent')}
      title="Intent"
    />
  )}

  Tooltips should only appear when the user has paused on the target element.
  They should remain visible if the user briefly moves the mouse off and back
  on to the target.

  Similarly tooltips should not immediately disappear, unless the user hovers
  over another element with a tooltip.

  When the user scrolls, their attention is no longer on the tooltip. We take this
  opportunity to immediately hide the tooltip.

    * Mouse over, then off, a single target for a fade transition.
    * Mouse between each target for an immediate transition.
    * Mouse over, off briefly, then back over &mdash; there will be no transition.
    * Mouse over a target then scroll, the tooltip will be removed immediately.

  Note that when using the 'mouse' position, mousing between targets will not cause an
  immediate transition as this would display the tooltip at the target boundary
  rather than a more natural position.

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Tooltip')}
    />
  )}
`;

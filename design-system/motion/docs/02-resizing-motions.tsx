import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ## \`useResizingHeight()\`

  <br />

  ${(
    <SectionMessage title="Warning: Potentially janky" appearance="warning">
      <p>
        This hook animates <code>height</code> which is{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Performance_best_practices_for_Firefox_fe_engineers#Get_familiar_with_the_pipeline_that_gets_pixels_to_the_screen"
        >
          notoriously unperformant
        </a>
        . <strong>Test your app over low powered devices</strong>, you may want
        to avoid this if you can see it impacting FPS.
      </p>
    </SectionMessage>
  )}

  <br />

  This hook will animate \`height\` changes over state changes.
  If the height hasn't changed nothing will happen.

  ${(
    <Example
      highlight="13,53"
      packageName="@atlaskit/motion"
      Component={require('../examples/resizing-height').default}
      title="Resizing height"
      source={require('!!raw-loader!../examples/resizing-height')}
    />
  )}

  ### Optimizations

  Every state update (and thus a new render) will cause this hook to check if the \`height\` has changed via [\`getBoundingClientRect()\`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
  Because of that you'll probably want to make sure renders only happen if your props actually change.
  Remember to **measure first and optimize second**.

  If you see this slowing things down make sure to utilise either [\`React.memo()\`](https://reactjs.org/docs/react-api.html#reactmemo) or [\`PureComponent()\`](https://reactjs.org/docs/react-api.html#reactpurecomponent),
  **try placing it as high in the tree** as makes sense.
  Amusingly if you have too many \`React.memo()\` or \`PureComponent\`'s you could get worse performance.

  <br />

  ${code`
import React, { memo } from 'react';
import { useResizingHeight } from '@atlaskit/motion';

export default memo(({ title }) => (
  <div {...useResizingHeight()}>
    {title}
  </div>
));
`}

  ### Opts

  Passed in as an object in the first argument of the hook.

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/resizing/height')}
    />
  )}

  ### \`<ResizingHeight />\`

  Component which consumes the \`useResizingHook()\` under-the-hood.
  Its props are the same as the hooks opts.

  ${code`
import { ResizingHeight } from '@atlaskit/motion';

<ResizingHeight>
  {props => <div {...props} />}
</ResizingHeight>
  `}

  #### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/resizing/height')}
    />
  )}
`;

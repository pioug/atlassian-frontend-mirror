import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';
import Lozenge from '@atlaskit/lozenge';
import Tooltip from '@atlaskit/tooltip';

const ExitingOnly = () => (
  <Tooltip
    content={`This motion only has an exiting motion.
StaggeredEntrance will have no effect.`}
  >
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
    <span tabIndex={0}>
      <Lozenge appearance="removed">Exiting only</Lozenge>
    </span>
  </Tooltip>
);

export default md`
  Motion comes with entering motions out of the box.
  Most motions have a **pairing exiting motion**,
  while some only have an exiting motion and no entering.

  For consistency - don't try to mix & match.
  If an element **enters with one motion** it should **leave with the same motion**.

  ## \`<FadeIn />\`

  Useful for fading in one or more elements.

  ${(
    <Example
      highlight="5,19-21"
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-out-single-element').default}
      title="Single element"
      source={require('!!raw-loader!../examples/fade-out-single-element')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/fade-in')}
    />
  )}

  ## \`<SlideIn />\`

  Will slide an element into position,
  generally used for things that appear from outside of the viewport into view.

  ${(
    <Example
      highlight="7,37-52"
      packageName="@atlaskit/motion"
      Component={require('../examples/slide-in').default}
      title="Slide in element"
      source={require('!!raw-loader!../examples/slide-in')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/slide-in')}
    />
  )}

  ## \`<ZoomIn />\`

  Will over zoom an element into position.

  ${(
    <Example
      highlight="6,20-36"
      packageName="@atlaskit/motion"
      Component={require('../examples/zoom-in').default}
      title="Zoom in elements"
      source={require('!!raw-loader!../examples/zoom-in')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/zoom-in')}
    />
  )}

  ## \`<ShrinkOut />\`

  ${(<ExitingOnly />)}

  Will shrink an element down to nothing when exiting.
  Works best with flex children as collapsing margins can come with undesired behaviour.

  ${(
    <Example
      highlight="6,29-57"
      packageName="@atlaskit/motion"
      Component={require('../examples/shrink-out').default}
      title="Shrink out elements"
      source={require('!!raw-loader!../examples/shrink-out')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/shrink-out')}
    />
  )}

  ## \`<StaggeredEntrance />\`

  Useful for staggering an entering motion over many elements.

  ${(
    <Example
      highlight="11,35-38,40,63-66"
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-in-list-of-elements').default}
      title="List of elements"
      source={require('!!raw-loader!../examples/fade-in-list-of-elements')}
    />
  )}

  ${(
    <Example
      highlight="16,68-77,83-87"
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-in-grid-of-elements').default}
      title="Grid of elements"
      source={require('!!raw-loader!../examples/fade-in-grid-of-elements')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/staggered-entrance')}
    />
  )}

  ## \`<ExitingPersistence />\`

  Useful for enabling elements to persist and animate away when they are removed from the DOM.

  ${(
    <Example
      highlight="7,79-81,34-45,21-22"
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-between-elements').default}
      title="Single element"
      source={require('!!raw-loader!../examples/fade-between-elements')}
    />
  )}

  ${(
    <Example
      highlight="13,50-54,89-92"
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-out-list-of-elements').default}
      title="List of elements"
      source={require('!!raw-loader!../examples/fade-out-list-of-elements')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/exiting-persistence')}
    />
  )}
`;

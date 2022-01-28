import React from 'react';

import { DevPreviewWarning, Example, md, Props } from '@atlaskit/docs';

export default md`
${(<DevPreviewWarning />)}

${(
  <Example
    packageName="@atlaskit/rating"
    Component={require('../examples/star-rating').default}
    title="Composing with star group and star"
    source={require('!!raw-loader!../examples/star-rating')}
  />
)}

## RatingGroup

Container for all ratings -
compose this with the out-of-the-box \`<Star />\` or compose your own rating item with \`<Rating />\`.

### Props

${(
  <Props
    heading=""
    props={require('!!extract-react-types-loader!../src/components/rating-group')}
  />
)}

## Star

This is a composed \`<Rating />\` that is displayed as a star.

Don't use this by itself - it won't work as you expect it to.
Use this in conjunction with \`<RatingGroup />\`.

${(
  <Example
    packageName="@atlaskit/rating"
    Component={require('../examples/uncontrolled').default}
    title="Composing with star"
    source={require('!!raw-loader!../examples/uncontrolled')}
  />
)}

### Props

${(
  <Props
    heading=""
    props={require('!!extract-react-types-loader!../src/components/star-type')}
  />
)}

## Rating

Rating item component that is highly customizable.
It uses a radio input as its underlying markup to ensure accessibility for screen readers and keyboard interactions.

Don't use this by itself - it won't work as you expect it to.
Use this in conjunction with \`<RatingGroup />\`.

${(
  <Example
    packageName="@atlaskit/rating"
    Component={require('../examples/custom-rating').default}
    title="Composing with rating"
    source={require('!!raw-loader!../examples/custom-rating')}
  />
)}

### Props

${(
  <Props
    heading=""
    props={require('!!extract-react-types-loader!../src/components/rating-type')}
  />
)}

### Gotchas

\`RatingGroup\` sets \`font-size\` to \`0\` to work around \`inline-block\` spacing issues (and thus all children get this via the cascade).
When composing your own rating make sure to explicitly set \`font-size\` if needed like in the example above.
`;

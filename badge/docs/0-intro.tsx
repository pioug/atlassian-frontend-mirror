import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';

export default md`
  Badges are visual indicators for **numeric values** such as tallies and scores.
  They're commonly used before and after the label of the thing they're quantifying.

  For **non-numeric** status information please use a [lozenge](/packages/core/lozenge).

  Make sure to compose with a [tooltip](/packages/core/tooltip) when needing to provide extra context,
  for example indicating units.

  ## Usage

  This component gives you the full badge functionality and automatically formats the number you provide in \`children\`.
  For more fine-grained control have a look at the [composing](/packages/core/badge/docs/composing) docs.

${code`
import Badge from '@atlaskit/badge';

// Displays: 99+
<Badge>{1000}</Badge>

// Displays: 999+
<Badge max={999}>{1000}</Badge>
`}

${(
  <Example
    highlight="4,31-33,37,41,45,49,53,57,61,65,69-71"
    packageName="@atlaskit/badge"
    Component={require('../examples/0-basic').default}
    title="Basic"
    source={require('!!raw-loader!../examples/0-basic')}
  />
)}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components')}
    />
  )}
`;

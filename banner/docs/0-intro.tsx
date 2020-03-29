import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
This banner component is designed to display a prominent message at the
top of the page. It animates its opening and closing, and is not dismissible.

## Usage

${code`import Banner from '@atlaskit/banner';`}

${(
  <Example
    packageName="@atlaskit/banner"
    Component={require('../examples/AnimationExample').default}
    title="Animation"
    source={require('!!raw-loader!../examples/AnimationExample')}
  />
)}

There are three kinds of banner. Error and warning banners are of a fixed height
and do not overflow text.

Announcement banners work slightly differently in that the text wraps. They expand
to a maximum height of 88 pixels, and after that they allow you to scroll to see
the rest of the content.

We recommend using banner with [@atlaskit/page](./page), particularly if you are
using [@atlaskit/navigation](./navigation) alongside it.

${(
  <Props
    heading="Banner Props"
    props={require('!!extract-react-types-loader!../src/components/Banner')}
  />
)}
`;

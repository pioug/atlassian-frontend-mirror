import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
# Flexible UI: ElementItem

Some Flexible UI blocks such as TitleBock and MetadataBlock offer areas to host
optional metadata elements.
These elements represent link metadata in various shape and form, e.g. authors,
number of comments, priority, etc.

${(
  <Props
    heading="Props"
    props={require('!!extract-react-types-loader!../docs-helpers/flexible-ui-element-item')}
  />
)}
`;

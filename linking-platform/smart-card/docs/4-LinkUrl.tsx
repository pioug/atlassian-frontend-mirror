import React from 'react';

import ContentTabs from './utils/content-tabs';
import { TabName } from './utils';
import examples from './content/link-url/examples';
import reference from './content/link-url/reference';
import customMd from './utils/custom-md';
import { code } from '@atlaskit/docs';
import LinkUrl from '../src/view/LinkUrl';

export default customMd`

### Introduction
We want to warn users if a link description text looks like a URL but the actual link destination is different.


For instance, the link like this [www.atlassian.com](https://www.google.com/) leads to the google.com instead of expected www.atlassian.com

${code`
<a href="https://www.google.com/" ...>www.atlassian.com</a>
`}

**LinkUrl** component has a built-in safety check and can be used as a plain hyperlink <a> tag where we want to have
a link safety check.

**NOTE**: We want to keep the link safety validation simple and check ANY difference between a link destination
and link description text.

For instance:
**https://www.atlassian.com/?tab=work-management** as a destination and **https://www.atlassian.com** as a link description triggers
a warning.

### Installation

${code`
yarn add @atlaskit/smart-card
`}

### Simple usage

${code`
import LinkUrl from '@atlaskit/smart-card/link-url';

<LinkUrl href='https://www.google.com/ safetyCheck={true} >
  www.atlassian.com
</LinkUrl>
`}

Please, click on the link below to see the warning message.

${(<LinkUrl href="https://www.google.com/">www.atlassian.com</LinkUrl>)}

${(
  <ContentTabs
    tabs={[
      { name: TabName.Examples, content: examples },
      { name: TabName.Reference, content: reference },
    ]}
  />
)}

`;

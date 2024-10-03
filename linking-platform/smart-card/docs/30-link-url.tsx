import { code } from '@atlaskit/docs';
import React from 'react';
import LinkUrl from '../src/view/LinkUrl';
import examples from './content/link-url/examples';
import reference from './content/link-url/reference';
import { TabName } from './utils';

import ContentTabs from './utils/content-tabs';
import customMd from './utils/custom-md';
import DocQuickLinks from './utils/doc-quick-links';

export default customMd`

${(<DocQuickLinks />)}

We want to warn users if a link description text looks like a URL but the actual link destination is different.

For instance, the link like this [www.atlassian.com](https://www.google.com/) leads to the google.com instead of expected www.atlassian.com

${code`
<a href="https://www.google.com/" ...>www.atlassian.com</a>
`}

**LinkUrl** component has a built-in safety check and can be used as a plain hyperlink <a> tag where we want to have
a link safety check.

Note that when the checkSafety is true we only call the onClick function when the link is safe. If you would like to ensure that the onClick
is always called then you can disable the safety checking by setting the safetyCheck to false. This is because onClick is often used to
programatically open a link in a new tab or window and we don't want the links to open until we have checked that they are safe.

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

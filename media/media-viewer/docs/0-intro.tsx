import React from 'react';
import { md, AtlassianInternalWarning } from '@atlaskit/docs';
import props from './content/props';
import example from './content/example';
import { DocsContentTabs } from '@atlaskit/media-test-helpers';

export default md`
${(<AtlassianInternalWarning />)}

MediaViewer is Atlassian's powerful solution for viewing files on the web. It's both powerful and extendable yet easy-to-integrate

  ${(
		<DocsContentTabs
			tabs={[
				{ name: 'Usage', content: example },
				{ name: 'Props', content: props },
			]}
		/>
	)}
  `;

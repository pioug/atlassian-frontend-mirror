import React from 'react';
import { md, AtlassianInternalWarning } from '@atlaskit/docs';
import { DocsContentTabs } from '@atlaskit/media-test-helpers';
import filmStripExamples from './content/example';
import filmStripProps from './content/props';
const _default_1: any = md`
${(<AtlassianInternalWarning />)}

  This component displays multiple media cards horizontally. Allows to navigate through the stored cards.

  ${(
		<DocsContentTabs
			tabs={[
				{ name: 'Usage', content: filmStripExamples },
				{ name: 'Props', content: filmStripProps },
			]}
		/>
	)}
`;
export default _default_1;

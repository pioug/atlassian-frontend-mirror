import React from 'react';
import { md, AtlassianInternalWarning } from '@atlaskit/docs';
import { DocsContentTabs } from '@atlaskit/media-test-helpers';
import UsageTab from './content/usage';
import PropsDefinitionTab from './content/props-definitions';

export default md`
  ${(<AtlassianInternalWarning />)}

  ### Description
  This package provides the capability to display the already uploaded media in tabular format with pagination.

  ${(
		<DocsContentTabs
			tabs={[
				{ name: 'Usage', content: UsageTab },
				{ name: 'Props Definition', content: PropsDefinitionTab },
			]}
		/>
	)}
`;

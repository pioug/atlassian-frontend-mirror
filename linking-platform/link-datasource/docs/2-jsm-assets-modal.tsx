import React from 'react';

import { AtlassianInternalWarning, code, Example, md } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

  ## JSM Assets Configuration Modal Props

  The JSM Assets Configuration Modal has additional parameters that are required to fetch data from the API. Below are the props that are unique to the Assets modal.

  <br/>

  ${code`
/**
 * workspaceId is required along with the schemaId in the context of permissions
 * to allow specific, configured users to view assets data outside of assets
 * ex: ari:cloud:cmdb::schema/{workspaceId}/{schemaId}
*/
workspaceId: string;
schemaId: string;

/**
 * assets query language which allows users to perform more advanced searches for assets
 * see below for more information:
 * https://support.atlassian.com/jira-service-management-cloud/docs/use-assets-query-language-aql/
*/
aql?: string;
  `}

  ## Example

  ${(
		<Example
			packageName="@atlaskit/link-datasource"
			Component={require('./examples/basic-assets-config-modal').default}
			title="JSM Assets Configuration Modal"
			source={require('!!raw-loader!./examples/basic-assets-config-modal')}
		/>
	)}
`;

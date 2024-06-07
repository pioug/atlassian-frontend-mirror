import React from 'react';

import { AtlassianInternalWarning, code, Example, md } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

  ## Jira Issues Configuration Modal Props

  The Jira Issues Configuration Modal has additional parameters that are required to fetch data from the API. Below are the props that are unique to the Jira Issues Modal.

  <br/>

  ${code`
/** used to identify the site from which to fetch data */
cloudId: string;

/**
 * query language specific to Jira to perform advanced search.
 * see below for more information:
 * https://support.atlassian.com/jira-software-cloud/docs/use-advanced-search-with-jira-query-language-jql/
*/
jql?: string

/** used to filter for specific data */
filter?: string
  `}

  ## Example

  ${(
		<Example
			packageName="@atlaskit/link-datasource"
			Component={require('./examples/basic-jira-issues-config-modal').default}
			title="Jira Issues Configuration Modal"
			source={require('!!raw-loader!./examples/basic-jira-issues-config-modal')}
		/>
	)}
`;

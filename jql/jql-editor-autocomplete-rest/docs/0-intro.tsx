import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';

export default md`

  ${(<AtlassianInternalWarning />)}

  This package wraps the callbacks needed to fetch autocomplete data for the JQL editor, and provides simple hooks to
  delegate to [Jira Cloud REST API's](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-jql/).

  We require these configurable hooks to allow consumers to define their own fetch library given their app environment,
  e.g. Jira, Connect, Forge etc.

  ## Usage

  A minimal configuration of the autocomplete provider is as follows:

  ${code`
import { useAutocompleteProvider } from '@atlaskit/jql-editor-autocomplete-rest';

const getInitialData = async (url: string) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ includeCollapsedFields: true })
  });
  const data = response.json();

  return {
    jqlFields: data.visibleFieldNames,
    jqlFunctions: data.visibleFunctionNames,
  };
};

const getSuggestions = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

const useMyAutocompleteProvider = () => {
  return useAutocompleteProvider('my-app', getInitialData, getSuggestions);
};
  `}

  ## Support

  For developers outside of Atlassian looking for help, or to report issues, [please make a post on the community forum](https://community.developer.atlassian.com/c/atlassian-ecosystem-design).
  We will monitor the forums and redirect topics to the appropriate maintainers.

`;

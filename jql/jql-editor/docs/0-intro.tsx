import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';

export default md`

  ${(<AtlassianInternalWarning />)}

  This package allows consumers to render an advanced JQL editor component to enable autocomplete-assisted authoring and
  validation of JQL queries.

  ## Usage

  To render the editor, the consumer must configure an \`autocompleteProvider\`, which defines callback functions used to
  retrieve JQL fields, functions and values. To ease configuration, we also ship the
  \`@atlaskit/jql-editor-autocomplete-rest\` package, which wraps these callbacks and provides simple hooks to delegate
  to Jira REST API's.

  A minimal configuration of the JQL editor is as follows:

  ${code`
import { useCallback } from 'react';
import { JQLEditorAsync as JQLEditor } from '@atlaskit/jql-editor';
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

const MyJQLEditor = () => {
  const autocompleteProvider = useAutocompleteProvider('my-app', getInitialData, getSuggestions);

  const onSearch = useCallback((jql: string) => {
    // Do some action on search
  }, []);

  return (
    <JQLEditor
      analyticsSource={'my-app'}
      query={''}
      onSearch={onSearch}
      autocompleteProvider={autocompleteProvider}
      locale={"en"}
    />
  );
};
  `}

  For app developers, please refer to the \`@atlassianlabs/jql-editor-connect\` and \`@atlassianlabs/jql-editor-forge\`
  packages. Which come pre-configured with Jira autocomplete integration.

  ## Documentation

  ### Searching and authoring JQL

  There are two main use cases for the editor:

  1. Searching by a JQL query
  2. Authoring a JQL query

  The key difference between the two is that rendering a search button may not make sense when authoring JQL, e.g. when
  using the JQL editor as a form input. The searching use case is documented above, here we'll discuss authoring.

  #### Authoring JQL

  Hiding the search button is as simple as not providing an \`onSearch\` prop. Instead you'll want to use \`onUpdate\` which
  is triggered whenever the query is updated.

  By default, the editor will automatically show any syntax errors when the user presses search. Without the search button
  the consumer will need to set errors to show manually.

  ${code`
import { useCallback, useMemo, useState } from 'react';
import { Jast, JQLParseError } from '@atlaskit/jql-ast';
import { JQLEditorAsync as JQLEditor, ExternalError } from '@atlaskit/jql-editor';
import debounce from 'lodash/debounce';

const MyJQLEditor = () => {
  const [errors, setErrors] = useState<ExternalError[]>([]);

  const debounceSetErrors = useMemo(() => {
    // Update our errors after a 1 second debounce
    return debounce((parseErrors: JQLParseError[]) => {
      // Format JQL parse errors to be shown as custom error messages in the editor
      const errorMessages: ExternalError[] = parseErrors.map(({ description }) => ({
        message: description,
        type: 'error',
      }));
      setErrors(errorMessages)
    }, 1000);
  }, [setErrors]);

  const onUpdate = useCallback((jql: string, jast: Jast) => {
    debounceSetErrors(jast.errors)
  }, []);

  return (
    <JQLEditor
      analyticsSource={'my-app'}
      query={''}
      onUpdate={onUpdate}
      messages={errors}
      autocompleteProvider={/* ... */}
      locale={"en"}
    />
  );
};
  `}

  Using the same API, the editor may also show warning and info messages:

  ${code`
const [messages] = useState<ExternalMessage[]>([
  { type: 'error', message: \`I'm an error message\`} as ExternalError,
  { type: 'warning', message: \`I'm a warning message\`} as ExternalWarning,
  { type: 'info', message: \`I'm an info message\`} as ExternalInfo,
]);

return (
  <JQLEditor
    {/* ... */}
    messages={messages}
  />
);
  `}

  Its worth mentioning that messages are rendered by the priority and only a single type of messages could be present on UI at once.

  So in the example above, only an error message will be rendered.

  ## Support

  For developers outside of Atlassian looking for help, or to report issues, [please make a post on the community forum](https://community.developer.atlassian.com/c/atlassian-ecosystem-design).
  We will monitor the forums and redirect topics to the appropriate maintainers.

`;

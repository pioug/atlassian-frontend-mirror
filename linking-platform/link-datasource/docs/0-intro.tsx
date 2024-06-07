import React from 'react';

import { AtlassianInternalWarning, code, Example, md, Props } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

  <br/>

  The Link Datasource package exports configuration modals and a smart link list view which allows users to source and display multiple objects as a list with configurable display options.

  The package also exports (via elements) a renderType function which is used to render data into specific supported types in the smart link list view. Please refer to platform/packages/linking-platform/link-datasource/src/ui/issue-like-table/render-type to view the available types.

  If you have any questions, you can reach out to [#help-linking-platform](https://atlassian.slack.com/archives/CFKGAQZRV) for help.

  ## Installation

  ${code`yarn add @atlaskit/link-datasource`}

  ## Using the Smart Link List View Component

  ${code`
import { DatasourceTableView } from '@atlaskit/link-datasource';
...
return (
  <DatasourceTableView {...props} />
)
`}

${(
	<Props
		shouldCollapseProps
		heading="Props"
		props={require('!!extract-react-types-loader!../src/ui/datasource-table-view')}
	/>
)}

  ## Smart Link List View Component Example

  ${(
		<Example
			packageName="@atlaskit/link-datasource"
			Component={require('./examples/basic-jira-issues-list').default}
			title="Smart Link List View"
			source={require('!!raw-loader!./examples/basic-jira-issues-list')}
		/>
	)}

  ## Using the Configuration Modal Component

  <br />

  ${code`
import { ConfluenceSearchModal } from '@atlaskit/link-datasource';
...
return (
  <ConfluenceSearchModal {...props} />
)
`}

  ## Common Configuration Modal Props

  Each Configuration Modal component type has additional unique props that will be explained further in their respective subpages.
  However, below are the common props that are shared between them.

  <br/>

  ${code`
export type DisplayViewModes = 'table' | 'inline';

export type ConfigModalProps<ADF, Parameters> = {
  /** Unique identifier for which type of datasource is being rendered and for making its requests */
  datasourceId: string;

  /** The url that was used to insert a List of Links */
  url?: string;

  /** Parameters for making the data requests necessary to render data within the table */
  parameters?: Parameters;

  /** Callback function to be invoked when the modal is closed either via cancel button click, esc keydown, or modal blanket click */
  onCancel: () => void;

  /** Callback function to be invoked when the insert button is clicked */
  onInsert: (adf: ADF, analyticsEvent?: UIAnalyticsEvent) => void;

  /**
   * The view mode that the modal will show on open:
   * - Table = Displays a list of links in table format
   * - Inline = Presents a smart link that shows the count of query results. However, if there's only one result, it converts to an inline smart link of that issue.
   */
  viewMode?: DisplayViewModes;
} & Partial<
  Pick<
    IssueLikeDataTableViewProps,
    'visibleColumnKeys' | 'wrappedColumnKeys' | 'columnCustomSizes'
  >
>;
  `}
  ## Configuration Modal Component Example

  ${(
		<Example
			packageName="@atlaskit/link-datasource"
			Component={require('./examples/basic-jira-issues-config-modal').default}
			title="Configuration Modal Component"
			source={require('!!raw-loader!./examples/basic-jira-issues-config-modal')}
		/>
	)}
`;

import React from 'react';

import { AtlassianInternalWarning, code, Example, md, Props } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

  <br/>

  ## What is a Smart Link List View (Datasource)

  A **Smart Link List View** allows users to query a **Datasource** and surface founds items to dynamically display in a user interface. For example:
  - a JQL query surfacing a list of Jira issues
  - a search query surfacing a list of Confluence pages
  - a link to a list of Github issues

  This **Link Datasource** package exposes various UI components including:
  - a **Smart Link List View** which dynamically displays the items found in a **Datasource**, see [<DatasourceTableView />](https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/linking-platform/link-datasource/src/ui/datasource-table-view/index.tsx)
  - **Configuration Modals** which can be used to configure datasources

  These UI components are backed by backend capabilities offered by Object Resolver Service (ORS) and Linking Platform.

  The package also exports (via elements) a \`renderType\` function which is used to render data of supported types in corresponding formats in the Smart Link List View. Please refer to \`platform/packages/linking-platform/link-datasource/src/ui/issue-like-table/render-type\` to view the available types.

  ## Using the Smart Link List View package
  #### If you want your app to be able to render a datasource as a list of items
  You will need to do this 2 things in your app:
  1. checking if an url is a valid datasource url via ORS endpoint \`/resolve\` or \`/resolve/batch\`.
  2. if it is, you can render the surfaced items in a table view using the \`DatasourceTableView\` component.
  #### If you have an url that can be recognized as a datasource, and you want to expose it through the Smart Link List View
  The capacity of unfurling an url to a Smart Link List View is called auto-resolve. Auto-resolve is done in the ORS. Please refer to [ORS documentation](https://bitbucket.org/atlassian/object-resolver-service/src/master/) for more information on how to add auto-resolve for your datasource.

  Optionally, if you are looking to provide your customer a way to edit the datasource they created, you can do so by creating your own configuration modal. Please refer to the [Writing a Datasource Modal](/packages/linking-platform/link-datasource/docs/writing-a-datasource-modal) guide.

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

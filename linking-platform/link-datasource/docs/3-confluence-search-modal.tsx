import React from 'react';

import { AtlassianInternalWarning, code, Example, md } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

  ## Confluence Search Configuration Modal Props

  The Confluence Search Configuration Modal has additional parameters that are required to fetch data from the API. Below are the props that are unique to the Confluence Search Modal.

  <br/>

  ${code`
/** used to identify the site to search */
cloudId: string;

/** query to search confluence objects */
searchString?: string;

/** list of entity types to search for */
entityTypes?: string[];

/** list of Atlassian Resource Identifiers to reference specific content */
contentARIs?: string[];

/** unique identifiers used to reference specific spaces within confluence */
spaceKeys?: string[];

/** user account ids that created or updated the entity type */
contributorAccountIds?: string[];

/** labels that are present on the result object */
labels?: string[];

/** ids of the pages that are parents of the result */
ancestorPageIds?: string[];

/** status of confluence object */
containerStatus?: string[];

/**
 * refers to the state of the content for example:
 * DRAFT, CURRENT, ARCHIVED, DELETED
 */
contentStatuses?: string[];

/**
 * unique identifier associated with the user account
 * that created an entity type such as a page
 * */
creatorAccountIds?: string[];

/**
 * represents point of time to perform search for example:
 * today, yesterday, past7Days, past30Days, pastYear, custom.
 * if custom is selected, lastModifiedFrom and lastModifiedTo should be provided.
 */
lastModified?: DateRangeType;

/** date that custom lastModified should be greater than */
lastModifiedFrom?: string;

/** date that custom lastModified should be less than */
lastModifiedTo?: string;

/** search only for entities with title containing given query */
shouldMatchTitleOnly?: boolean;

/** if true, does not render the dropdown to change display view between list and inline */
disableDisplayDropdown?: boolean;

/**
 * overrideParameters.entityTypes values can be set to restrict your search results to specific confluence entities.
 * for example, if you want your table to display only pages and blogposts, the value for entityTypes[] would be:
 * - ati:cloud:confluence:blogpost
 * - ati:cloud:confluence:page
*/
overrideParameters?: Pick<
  ConfluenceSearchDatasourceParameters,
  'entityTypes'
>;
  `}
  ## Example

  ${(
    <Example
      packageName="@atlaskit/link-datasource"
      Component={
        require('./examples/basic-confluence-search-config-modal').default
      }
      title="Confluence Search Configuration Modal"
      source={require('!!raw-loader!./examples/basic-confluence-search-config-modal')}
    />
  )}
`;

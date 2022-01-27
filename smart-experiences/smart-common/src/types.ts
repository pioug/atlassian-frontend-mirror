export enum EntityType {
  USER = 'USER',
  TEAM = 'TEAM',
  GROUP = 'GROUP',
}

export interface UserSearchBitbucketAttributes {
  /**
   * Identifies whether this is a public repository or not.
   */
  isPublicRepo?: boolean;
  /**
   * A list of bitbucket workspace Ids used within container result set and noted in analytics.
   */
  workspaceIds?: string[];
  /**
   * The users current email domain which may be used to boost the results for relevant users.
   */
  emailDomain?: string;
}

export interface UserSearchConfluenceAttributes {
  /**
   * Identifies whether this user is a confluence guest
   */
  isEntitledConfluenceExternalCollaborator?: boolean;
}

export type UserSearchProductAttributes =
  | UserSearchBitbucketAttributes
  | UserSearchConfluenceAttributes;

export interface UserSearchContext {
  childObjectId?: string;
  containerId?: string;
  contextType: string;
  objectId?: string;
  principalId?: string;
  productAttributes?: UserSearchProductAttributes;
  productKey: string;
  sessionId?: string;
  siteId: string;
}

export interface UserSearchQuery {
  cpusQueryHighlights?: {
    /**
     * The query used to highlight the results.
     */
    query?: string;
    /**
     * The fields to highlight.
     */
    field?: string;
  };
  /**
   * A lucene-style simple query formatted string for the term search expression. For example,
   * @example account_type:atlassian
   */
  customQuery?: string;
  /**
   * A customer directory ID to search for JSD customer accounts.
   */
  customerDirectoryId?: string;
  /**
   *  The lucene-style simple query format string for the filter (unscored) expression.
   *  Example:`account_status:"active" AND (NOT email_domain:"connect.atlassian.com")`
   *  will remove inactive users from the list of suggestions.
   */
  filter?: string;
  /**
   * Sets the minimum contextual access level that a user must have in order to be included in
   * the recommendations. Defaults to APPLICATION. At present, URS will not search for users with an
   * access level of NONE.
   */
  minimumAccessLevel?: string;
  /**
   * Restriction on the users and groups that should be applied to the search
   */
  restrictTo?: {
    userIds?: string[];
    groupIds?: string[];
  };
  /**
   * Whether the principal and the results require Jira application access or
   * just require site access without product access.
   */
  searchUserbase?: boolean;
}

export interface UserSearchRequest {
  baseUrl?: string;
  context: UserSearchContext;
  maxNumberOfResults?: number;
  performSearchQueryOnly?: boolean;
  query?: string;
  includeUsers?: boolean;
  includeGroups?: boolean;
  includeTeams?: boolean;
  searchQuery?: UserSearchQuery;
}

export interface UserSearchItem {
  id: string;
  entityType: EntityType;
  avatarUrl: string;
  description?: string;
  displayName?: string;
  name?: string;
  teamAri?: string;
}

export interface UserSearchResponse {
  errors?: any[];
  recommendedUsers: UserSearchItem[];
}

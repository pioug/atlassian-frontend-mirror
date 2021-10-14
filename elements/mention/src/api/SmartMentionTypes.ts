export interface RecommendationRequest {
  baseUrl?: string;
  context: Context;
  maxNumberOfResults: number;
  query?: string;
  searchQueryFilter?: string;
  includeUsers?: boolean;
  includeGroups?: boolean;
  includeTeams?: boolean;
  fireAnalytics?: boolean;
}

export interface RecommendationResponse {
  errors?: any[];
  recommendedUsers: RecommendationItem[];
}

export interface Context {
  containerId?: string;
  contextType: string;
  objectId?: string;
  sessionId?: string;
  principalId: string;
  childObjectId?: string;
  productKey: string;
  siteId: string;
  productAttributes?: ProductAttributes;
}

export interface BitbucketAttributes {
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

export type ProductAttributes = BitbucketAttributes;

export enum EntityType {
  USER = 'USER',
  TEAM = 'TEAM',
  GROUP = 'GROUP',
}

//Previously ServerItem in smart-user-picker
export interface RecommendationItem {
  id: string;
  name?: string;
  entityType: EntityType;
  avatarUrl: string;
  description?: string;
  teamAri?: string;
  displayName?: string;
}

export interface UserRecommendation extends RecommendationItem {
  name: string;
  nickname?: string;
  entityType: EntityType.USER;
  email?: string;
  attributes?: Record<string, string>;
  accessLevel?: string;
  userType?: string;
}

export interface MemberItem {
  id: string;
  name: string;
}

export interface TeamRecommendation extends RecommendationItem {
  displayName?: string;
  entityType: EntityType.TEAM;
  description?: string;
  largeAvatarImageUrl?: string;
  smallAvatarImageUrl?: string;
  memberCount?: number;
  includesYou?: boolean;
  members: MemberItem[];
}

export interface GroupRecommendation extends RecommendationItem {
  entityType: EntityType.GROUP;
}

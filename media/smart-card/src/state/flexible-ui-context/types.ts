import { LinkLozenge } from '../../extractors/common/lozenge/types';
import { LinkPerson } from '../../extractors/common/person/types';
import { IconType, MediaType } from '../../constants';

/**
 * This provides the data that will be used by Smart Links Flexible UI to populate it's
 * underlying elements.
 */
export type FlexibleUiDataContext = {
  /**
   * An array containing data used to populate the AuthorGroup element.
   * @see AvatarGroup
   */
  authorGroup?: LinkPerson[];
  /**
   * An array containing a @type {LinkPerson} used to populate the CollaboratorGroup element.
   * @see CollaboratorGroup
   */
  collaboratorGroup?: LinkPerson[];
  /**
   * Contains the number of comments of the linked resource.
   * @type number
   * @see CommentCount
   */
  commentCount?: number;
  /**
   * Contains the number of views of the linked resource.
   * @type number
   * @see ViewCount
   */
  viewCount?: number;
  /**
   * Contains the number of react of the linked resource.
   * @type number
   * @see ReactCount
   */
  reactCount?: number;
  /**
   * Contains the number of votes of the linked resource.
   * @type number
   * @see VoteCount
   */
  voteCount?: number;
  /**
   * Contains the name of the entity that created the resource.
   * @type string
   * @see CreatedBy
   */
  createdBy?: string;
  /**
   * Contains the ISO timestamp of when the resource was created.
   * @type string - ISO Timestamp
   * @see CreatedOn
   */
  createdOn?: string;
  /**
   * Contains the favicon of the resource.
   * @type Icon
   * @see LinkIcon
   */
  linkIcon?: Icon;
  /**
   * Contains the name of the entity that last modified the resource.
   * @type string
   * @see ModifiedBy
   */
  modifiedBy?: string;
  /**
   * Contains the ISO timestamp of when the resource was last modified.
   * @type string - ISO Timestamp
   * @see ModifiedOn
   */
  modifiedOn?: string;
  /**
   * Contains the preview (typically the thumbnail) of the resource.
   * @type Media
   * @see Preview
   */
  preview?: Media;
  /**
   * Contains the priority icon of the resource.
   * @type Icon
   * @see Priority
   */
  priority?: Icon;
  /**
   * Contains the programming language of the resource.
   * @type string
   * @see ProgrammingLanguage
   */
  programmingLanguage?: string;
  /**
   * Contains the snippet of the resource.
   * @type string
   * @see Snippet
   */
  snippet?: string;
  /**
   * Contains the number of subscribers of the linked resource.
   * @type number
   * @see SubscriberCount
   */
  subscriberCount?: number;
  /**
   * Contains the number of subscribers of the linked resource.
   * @type number
   * @see SubscriberCount
   */
  state?: LinkLozenge;
  /**
   * Contains the Title of the linked resource.
   * @type string
   * @see Title
   */
  title?: string;
  /**
   * Contains the url of the linked resource.
   * @type string
   * @see Title
   */
  url?: string;
  /**
   * Contains the provider icon of the linked resource.
   * @type Icon
   * @see Provider
   */
  provider?: Icon;

  /**
   * Contains the information about the latest commit in the repository
   */
  latestCommit?: string;
};

export type Icon = {
  icon?: IconType;
  label?: string;
  url?: string;
};

export type Media = {
  type: MediaType;
  url: string;
};

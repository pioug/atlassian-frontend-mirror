import { LinkLozenge } from '../../extractors/common/lozenge/types';
import { LinkPerson } from '@atlaskit/link-extractors';
import { IconType, MediaType } from '../../constants';
import { InvokeRequestWithCardDetails } from '../hooks/use-invoke/types';
import type { CardInnerAppearance } from '../../view/Card/types';
import type { AnalyticsFacade } from '../analytics';

/**
 * This provides the data that will be used by Smart Links Flexible UI to populate it's
 * underlying elements.
 */
export type FlexibleUiDataContext = {
  /**
   * An array containing data used to populate the AssignedToGroup element.
   * @see AvatarGroup
   */
  assignedToGroup?: LinkPerson[];
  /**
   * Contains the number of attachments on the linked resource.
   * @type number
   * @see AttachmentCount
   */
  attachmentCount?: number;
  /**
   * An array containing data used to populate the AuthorGroup element.
   * @see AvatarGroup
   */
  authorGroup?: LinkPerson[];

  /**
   * A string displaying progress on a checklist
   * @see ChecklistProgress
   */
  checklistProgress?: string;
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
   * Contains the ISO timestamp of when the resource was due.
   * This value is mapped to JsonLD endTime.
   * @type string - ISO Timestamp
   * @see DueOn
   */
  dueOn?: string;
  /**
   * Contains data needed to perform follow action.
   * @type PreviewActionData
   * @see FollowAction
   */
  followAction?: ServerActionProp<boolean>;
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
   * Contains the name of the entity that has the resource assigend to.
   * @type string
   * @see AssignedTo
   */
  assignedTo?: string;
  /**
   * Contains the name of the entity that created the resource.
   * @type string
   * @see CreatedBy
   */
  createdBy?: string;
  /**
   * Contains the name of the entity that owns the resource.
   * @type string
   * @see OwnedBy
   */
  ownedBy?: string;
  /**
   * Contains the person that owns the resource.
   * @type LinkPerson
   * @see OwnedByGroup
   */
  ownedByGroup?: LinkPerson[];
  /**
   * Contains the ISO timestamp of when the resource was created.
   * @type string - ISO Timestamp
   * @see CreatedOn
   */
  createdOn?: string;

  /**
   * Contains data needed to show a preview action.
   * @type PreviewActionData
   * @see PreviewAction
   */
  previewAction?: PreviewActionData;

  /**
   * Contains data needed to show a view action.
   * @type ViewActionData
   * @see ViewAction
   */
  viewAction?: ViewActionData;

  /**
   * Contains data needed to show a download action.
   * @type DownloadActionData
   * @see DownloadAction
   */
  downloadAction?: DownloadActionData;

  /**
   * Contains the information about the latest commit in the repository
   */
  latestCommit?: string;
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
   * Contains the provider icon of the linked resource.
   * @type Icon
   * @see Provider
   */
  provider?: Icon;
  /**
   * Contains the snippet of the resource.
   * @type string
   * @see Snippet
   */
  snippet?: string;
  /**
   * Contains read time (time taken to read) of the resource
   */
  readTime?: string;
  /**
   * Contains the ISO timestamp of when the resource was created.
   * @type string - ISO Timestamp
   * @see SentOn
   */
  sentOn?: string;
  /**
   * Contains the source branch name of the link typed pull request.
   * @type string
   * @see SourceBranch
   */
  sourceBranch?: string;
  /**
   * Contains the number of subscribers of the linked resource.
   * @type number
   * @see SubscriberCount
   */
  subscriberCount?: number;
  /**
   * A string displaying progress on subtasks
   */
  subTasksProgress?: string;
  /**
   * Contains the number of subscribers of the linked resource.
   * @type number
   * @see SubscriberCount
   */
  state?: LinkLozenge;
  /**
   * Contains the no of story points for a task.
   * @type string
   * @see StoryPoints
   */
  storyPoints?: number;
  /**
   * Contains the target branch name of the link typed pull request.
   * @type string
   * @see TargetBranch
   */
  targetBranch?: string;
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
   * Contains the atlassian resource identifier (ARI) of the linked resource.
   * @type string
   * @see Title
   */
  ari?: string;
  /**
   * Contains the name and url of the location that the resource is located in.
   * @type LinkLocation
   * @see Location
   */
  location?: LinkLocation;
};

export type Icon = {
  icon?: IconType;
  label?: string;
  url?: string;
};

export type LinkLocation = {
  text: string;
  url: string;
};

export type Media = {
  type: MediaType;
  url: string;
};

export type PreviewActionData = {
  /* A download link - if it is provided, the download button will be shown */
  downloadUrl?: string;
  /* This should be the icon of the provider, which will be displayed to the left of the title */
  linkIcon?: Icon;
  /* Name of the provider, used in the link out to the document. */
  providerName?: string;
  /* URL used to load iframe */
  src?: string;
  /* The title of the document - this is displayed as a heading */
  title?: string;
  /* If you are not providing src, you should still provide a url, allowing people to access the page where the document is */
  url?: string;
  /* It determines whether a link source supports different design theme modes */
  isSupportTheming?: boolean;
};

export type ViewActionData = {
  /* A URL that will be navigated to upon clicking view actions */
  viewUrl?: string;
};

export type DownloadActionData = {
  /* A URL that will be download upon clicking download actions */
  downloadUrl?: string;
};

export type FlexibleAnalyticsContextType = AnalyticsFacade & {
  display?: CardInnerAppearance;
  extensionKey?: string;
};

export type ServerActionProp<TValue> = {
  /* A server action data used for invoke endpoint */
  action: InvokeRequestWithCardDetails;
  /* A toggle value */
  value?: TValue;
};

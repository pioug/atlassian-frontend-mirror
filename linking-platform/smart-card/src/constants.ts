export const CONTENT_URL_SECURITY_AND_PERMISSIONS =
  'https://support.atlassian.com/confluence-cloud/docs/insert-links-and-anchors/#Smart-links';

/**
 * The alignment of Flexible UI component.
 */
export enum SmartLinkAlignment {
  Left = 'left',
  Right = 'right',
}

/**
 * The direction of Flexible UI components. It establish the main-axis
 * or how the child components laid out inside the parent component.
 * Similar to flex's flex-direction concept.
 */
export enum SmartLinkDirection {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

/**
 * The positioning of the component within the parent component.
 * Similar to flex's align-items or align-self concept.
 */
export enum SmartLinkPosition {
  Top = 'top',
  Center = 'center',
}

/**
 * The sizing options of the Flexible UI component. Every component
 * has or inherits the sizing props. Implementation varies
 * as per component.
 */
export enum SmartLinkSize {
  XLarge = 'xlarge',
  Large = 'large',
  Medium = 'medium',
  Small = 'small',
}

/**
 * Smart Links link request status
 */
export enum SmartLinkStatus {
  Pending = 'pending',
  Resolving = 'resolving',
  Resolved = 'resolved',

  Forbidden = 'forbidden',
  Errored = 'errored',
  NotFound = 'not_found',
  Unauthorized = 'unauthorized',

  Fallback = 'fallback',
}

/**
 * Flexible UI theme available on the Card level.
 * This determine the styling of the link.
 */
export enum SmartLinkTheme {
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  Black = 'black',
  Link = 'link',
}

export enum SmartLinkInternalTheme {
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  Grey = 'grey',
}

/**
 * Determines whether the container size will fit to the content
 * or expand to the available width or the parent component.
 * Similar to flex's flex-grow concept.
 */
export enum SmartLinkWidth {
  FitToContent = 'fit-to-content',
  Flexible = 'flexible',
}

/**
 * Flexible UI element name - each reflecting the link data its represented.
 * When adding an element...
 * 1) Create base element if it doesn't already exist.
 *    Base element are inside src/view/FlexibleCard/components/elements.
 *    E.g. Badge, DateTime, Icon, Lozenge, etc.
 * 2) Update FlexibleUiContext with the new prop for data representing
 *    the element, preferably with the same name as the element itself.
 *    (src/state/flexible-ui-context/types.ts)
 * 3) Update Flexible UI extractor (src/extractors/flexible/index.ts)
 * 4) Set base element and data mapping
 *    (src/view/FlexibleCard/components/elements/utils.tsx)
 * 5) Create element. (src/view/FlexibleCard/components/elements/index.ts)
 * 6) Update element ElementDisplaySchema for inline/block display
 *    (src/view/FlexibleCard/components/blocks/utils.tsx)
 */
export enum ElementName {
  AssignedTo = 'AssignedTo',
  AssignedToGroup = 'AssignedToGroup',
  AttachmentCount = 'AttachmentCount',
  AuthorGroup = 'AuthorGroup',
  ChecklistProgress = 'ChecklistProgress',
  CollaboratorGroup = 'CollaboratorGroup',
  CommentCount = 'CommentCount',
  CreatedBy = 'CreatedBy',
  CreatedOn = 'CreatedOn',
  DueOn = 'DueOn',
  LatestCommit = 'LatestCommit',
  LinkIcon = 'LinkIcon',
  Location = 'Location',
  ModifiedBy = 'ModifiedBy',
  ModifiedOn = 'ModifiedOn',
  OwnedBy = 'OwnedBy',
  OwnedByGroup = 'OwnedByGroup',
  Preview = 'Preview',
  Priority = 'Priority',
  ProgrammingLanguage = 'ProgrammingLanguage',
  Provider = 'Provider',
  ReactCount = 'ReactCount',
  ReadTime = 'ReadTime',
  Snippet = 'Snippet',
  SourceBranch = 'SourceBranch',
  State = 'State',
  SubscriberCount = 'SubscriberCount',
  SubTasksProgress = 'SubTasksProgress',
  StoryPoints = 'StoryPoints',
  TargetBranch = 'TargetBranch',
  Title = 'Title',
  ViewCount = 'ViewCount',
  VoteCount = 'VoteCount',
  SentOn = 'SentOn',
}

/**
 * Flexible UI action (button)
 */
export enum ActionName {
  DeleteAction = 'DeleteAction',
  EditAction = 'EditAction',
  PreviewAction = 'PreviewAction',
  ViewAction = 'ViewAction',
  DownloadAction = 'DownloadAction',
  CustomAction = 'CustomAction',
}

/**
 * Flexible UI icons - each mapped to AK icons.
 */

export enum IconType {
  Archive = 'FileType:Archive',
  Audio = 'FileType:Audio',
  Blog = 'FileType:Blog',
  Code = 'FileType:Code',
  Document = 'FileType:Document',
  Executable = 'FileType:Executable',
  File = 'FileType:File',
  Folder = 'FileType:Folder',
  Generic = 'FileType:Generic',
  GIF = 'FileType:GIF',
  GoogleDocs = 'FileType:GoogleDocs',
  GoogleForms = 'FileType:GoogleForms',
  GoogleSheets = 'FileType:GoogleSheets',
  GoogleSlides = 'FileType:GoogleSlides',
  Image = 'FileType.Image',
  MSExcel = 'FileType:Excel',
  MSPowerpoint = 'FileType:Powerpoint',
  MSWord = 'FileType:WordDocument',
  PDF = 'FileType:PDF',
  Presentation = 'FileType:Presentation',
  Sketch = 'FileType:Sketch',
  Spreadsheet = 'FileType:Spreadsheet',
  Template = 'FileType:Template',
  Video = 'FileType:Video',

  // BitBucket?
  Branch = 'BitBucket:Branch',
  Commit = 'BitBucket:Commit',
  Project = 'BitBucket:Project',
  PullRequest = 'BitBucket:PullRequest',
  Repo = 'BitBucket:Repo',

  // Jira?
  Bug = 'Jira:Bug',
  Change = 'Jira:Change',
  Epic = 'Jira:Epic',
  Incident = 'Jira:Incident',
  Problem = 'Jira:Problem',
  ServiceRequest = 'Jira:ServiceRequest',
  Story = 'Jira:Story',
  SubTask = 'Jira:SubTask',
  Task = 'Jira:Task',

  // Provider
  Confluence = 'Provider:Confluence',
  Jira = 'Provider:Jira',

  // Fallback
  Default = 'Default',
  Error = 'Default:Error',
  Forbidden = 'Default:Forbidden',

  // Badge
  Attachment = 'Badge:Attachment',
  CheckItem = 'Badge:Task',
  Comment = 'Badge:Comment',
  View = 'Badge:View',
  React = 'Badge:React',
  Vote = 'Badge:Vote',
  PriorityBlocker = 'Badge:PriorityBlocker',
  PriorityCritical = 'Badge:PriorityCritical',
  PriorityHigh = 'Badge:PriorityHigh',
  PriorityHighest = 'Badge:PriorityHighest',
  PriorityLow = 'Badge:PriorityLow',
  PriorityLowest = 'Badge:PriorityLowest',
  PriorityMajor = 'Badge:PriorityMajor',
  PriorityMedium = 'Badge:PriorityMedium',
  PriorityMinor = 'Badge:PriorityMinor',
  PriorityTrivial = 'Badge:PriorityTrivial',
  PriorityUndefined = 'Badge:PriorityUndefined',
  ProgrammingLanguage = 'Badge:ProgrammingLanguage',
  Subscriber = 'Badge:Subscriber',
  SubTasksProgress = 'Badge:SubTask',
}

/**
 * Type for Flexible UI's Media element
 */
export enum MediaType {
  Image = 'image',
}

export enum MediaPlacement {
  Left = 'left',
  Right = 'right',
}

export enum CardDisplay {
  Inline = 'inline',
  Block = 'block',
  Embed = 'embed',
  EmbedPreview = 'embedPreview',
  Flexible = 'flexible',
  HoverCardPreview = 'hoverCardPreview',
}

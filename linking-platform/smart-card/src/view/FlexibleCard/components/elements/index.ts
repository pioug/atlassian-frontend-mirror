import { type ElementName, type SmartLinkSize } from '../../../../constants';

export type ElementProps = {
	/**
	 * For compiled css
	 */
	className?: string;
	/**
	 * Name of the element, can be used as a selector.
	 * E.g. [data-smart-element="Provider"]
	 * @internal
	 */
	name?: ElementName;
	/**
	 * The size of the element to display.
	 */
	size?: SmartLinkSize;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
};

export { default as AssignedTo } from './assigned-to-element';
export { default as AssignedToGroup } from './assigned-to-group-element';
export { default as AttachmentCount } from './attachment-count-element';
export { default as AuthorGroup } from './author-group-element';
export { default as ChecklistProgress } from './checklist-progress-element';
export { default as CollaboratorGroup } from './collaborator-group-element';
export { default as CommentCount } from './comment-count-element';
export { default as CreatedOn } from './created-on-element';
export { default as CreatedBy } from './created-by-element';
export { default as DueOn } from './due-on-element';
export { default as LatestCommit } from './latest-commit-element';
export { default as LinkIcon } from './link-icon-element';
export { default as Location } from './location-element';
export { default as ModifiedBy } from './modified-by-element';
export { default as ModifiedOn } from './modified-on-element';
export { default as OwnedBy } from './owned-by-element';
export { default as OwnedByGroup } from './owned-by-group-element';
export { default as Preview } from './preview-element';
export { default as Priority } from './priority-element';
export { default as ProgrammingLanguage } from './programming-language-element';
export { default as Provider } from './provider-element';
export { default as ReactCount } from './react-count-element';
export { default as ReadTime } from './read-time-element';
export { default as SentOn } from './sent-on-element';
export { default as Snippet } from './snippet-element';
export { default as SourceBranch } from './source-branch-element';
export { default as State } from './state-element';
export { default as SubscriberCount } from './subscriber-count-element';
export { default as SubTasksProgress } from './sub-tasks-progress-element';
export { default as StoryPoints } from './story-points-element';
export { default as TargetBranch } from './target-branch-element';
export { default as TeamMemberCount } from './team-member-count-element';
export { default as Title } from './title-element';
export { default as UserAttributes } from './user-attributes-element';
export { default as HostName } from './host-name-element';
export { default as ViewCount } from './view-count-element';
export { default as VoteCount } from './vote-count-element';
export { default as AppliedToComponentsCount } from './applied-to-components-count-element';
export { default as CustomByAccessTypeElement } from './custom-by-access-type-element';
export { default as CustomByStatusElement } from './custom-by-status-element';

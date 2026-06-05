import React from 'react';

import { injectIntl } from 'react-intl';
import type { WrappedComponentProps } from 'react-intl';

import BlogObject from '@atlaskit/object/blog';
import BugObject from '@atlaskit/object/bug';
import PageObject from '@atlaskit/object/page';
import StoryObject from '@atlaskit/object/story';
import TaskObject from '@atlaskit/object/task';
import WorkItemObject from '@atlaskit/object/work-item';
import { fg } from '@atlaskit/platform-feature-flags';

import type { LinkContentType } from '../../../provider-factory';

import { utilMessages } from './utilMessages';

const Issue16 = (props: WrappedComponentProps) => {
	const { intl } = props;
	return (
		<WorkItemObject
			label={intl.formatMessage(
				fg('confluence-issue-terminology-refresh')
					? utilMessages.hyperlinkIconIssueLabelIssueTermRefresh
					: utilMessages.hyperlinkIconIssueLabel,
			)}
		/>
	);
};

const Bug16 = (props: WrappedComponentProps) => {
	const { intl } = props;
	return <BugObject label={intl.formatMessage(utilMessages.hyperlinkIconBugLabel)} />;
};

const Story16 = (props: WrappedComponentProps) => {
	const { intl } = props;
	return <StoryObject label={intl.formatMessage(utilMessages.hyperlinkIconStoryLabel)} />;
};

const Task16 = (props: WrappedComponentProps) => {
	const { intl } = props;
	return <TaskObject label={intl.formatMessage(utilMessages.hyperlinkIconTaskLabel)} />;
};

const Page16 = (props: WrappedComponentProps) => {
	const { intl } = props;
	return <PageObject label={intl.formatMessage(utilMessages.hyperlinkIconPageLabel)} />;
};

const Blog16 = (props: WrappedComponentProps) => {
	const { intl } = props;
	return <BlogObject label={intl.formatMessage(utilMessages.hyperlinkIconBlogLabel)} />;
};

const IntlIssue16Icon = injectIntl(Issue16);
const IntlBug16Icon = injectIntl(Bug16);
const IntlStory16Icon = injectIntl(Story16);
const IntlTask16Icon = injectIntl(Task16);
const IntlPage16Icon = injectIntl(Page16);
const IntlBlog16Icon = injectIntl(Blog16);

export const mapContentTypeToIcon: {
	[key in LinkContentType]?: React.ReactElement;
} = {
	'jira.issue': <IntlIssue16Icon />,
	'jira.issue.bug': <IntlBug16Icon />,
	'jira.issue.story': <IntlStory16Icon />,
	'jira.issue.task': <IntlTask16Icon />,
	'confluence.page': <IntlPage16Icon />,
	'confluence.blogpost': <IntlBlog16Icon />,
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { filterUniqueItems } from './filterUniqueItems';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { sha1 } from './sha1';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { wordCount } from './wordCount';

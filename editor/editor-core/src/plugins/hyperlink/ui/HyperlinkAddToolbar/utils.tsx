import React from 'react';
import Rusha from 'rusha';
import Issue16Icon from '@atlaskit/icon-object/glyph/issue/16';
import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import Task16Icon from '@atlaskit/icon-object/glyph/task/16';
import Page16Icon from '@atlaskit/icon-object/glyph/page/16';
import Blog16Icon from '@atlaskit/icon-object/glyph/blog/16';
import type { LinkContentType } from '@atlaskit/editor-common/provider-factory';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import { utilMessages } from './messages';

const Issue16 = (props: WrappedComponentProps) => {
  const { intl } = props;
  return (
    <Issue16Icon
      label={intl.formatMessage(utilMessages.hyperlinkIconIssueLabel)}
    />
  );
};

const Bug16 = (props: WrappedComponentProps) => {
  const { intl } = props;
  return (
    <Bug16Icon label={intl.formatMessage(utilMessages.hyperlinkIconBugLabel)} />
  );
};

const Story16 = (props: WrappedComponentProps) => {
  const { intl } = props;
  return (
    <Story16Icon
      label={intl.formatMessage(utilMessages.hyperlinkIconStoryLabel)}
    />
  );
};

const Task16 = (props: WrappedComponentProps) => {
  const { intl } = props;
  return (
    <Task16Icon
      label={intl.formatMessage(utilMessages.hyperlinkIconTaskLabel)}
    />
  );
};

const Page16 = (props: WrappedComponentProps) => {
  const { intl } = props;
  return (
    <Page16Icon
      label={intl.formatMessage(utilMessages.hyperlinkIconPageLabel)}
    />
  );
};

const Blog16 = (props: WrappedComponentProps) => {
  const { intl } = props;
  return (
    <Blog16Icon
      label={intl.formatMessage(utilMessages.hyperlinkIconBlogLabel)}
    />
  );
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

export const sha1 = (input: string): string => {
  return Rusha.createHash().update(input).digest('hex');
};

export const wordCount = (input: string): number => {
  return input.split(' ').length;
};

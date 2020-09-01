import Issue16Icon from '@atlaskit/icon-object/glyph/issue/16';
import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import Task16Icon from '@atlaskit/icon-object/glyph/task/16';
import Page16Icon from '@atlaskit/icon-object/glyph/page/16';
import Blog16Icon from '@atlaskit/icon-object/glyph/blog/16';
import { LinkContentType } from '@atlaskit/editor-common';
import React from 'react';

export const mapContentTypeToIcon: {
  [key in LinkContentType]?: React.ReactElement;
} = {
  'jira.issue': <Issue16Icon label="Issue" />,
  'jira.issue.bug': <Bug16Icon label="Bug" />,
  'jira.issue.story': <Story16Icon label="Story" />,
  'jira.issue.task': <Task16Icon label="Task" />,
  'confluence.page': <Page16Icon label="Page" />,
  'confluence.blogpost': <Blog16Icon label="Blog" />,
};

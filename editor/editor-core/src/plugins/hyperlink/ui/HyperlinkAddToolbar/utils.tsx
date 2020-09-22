import React from 'react';
import Rusha from 'rusha';
import Issue16Icon from '@atlaskit/icon-object/glyph/issue/16';
import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import Task16Icon from '@atlaskit/icon-object/glyph/task/16';
import Page16Icon from '@atlaskit/icon-object/glyph/page/16';
import Blog16Icon from '@atlaskit/icon-object/glyph/blog/16';
import { LinkContentType } from '@atlaskit/editor-common';

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

export const sha1 = (input: string): string => {
  return Rusha.createHash().update(input).digest('hex');
};

export const wordCount = (input: string): number => {
  return input.split(' ').length;
};

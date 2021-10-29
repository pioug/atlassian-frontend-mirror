import React, { FC } from 'react';

import type { CommentProps } from '../types';

import Content from './content';
import FooterItems from './footer';
import HeaderItems from './header';
import CommentLayout from './layout';

/**
 * __Comment__
 *
 * Comments enable discussions on an entity such as a page, blog post, issue or pull request.
 */
const Comment: FC<CommentProps> = ({
  actions = [],
  restrictedTo = '',
  highlighted = false,
  isSaving = false,
  savingText = 'Sending...',
  isError = false,
  errorActions = [],
  errorIconLabel = '',
  author,
  avatar,
  children,
  content,
  edited,
  time,
  type,
  testId,
  id,
  afterContent,
  shouldRenderNestedCommentsInline,
}) => {
  const headerProps = {
    author,
    edited,
    isError,
    isSaving,
    restrictedTo,
    savingText,
    time,
    type,
  };
  const footerProps = {
    actions,
    errorActions,
    errorIconLabel,
    isError,
    isSaving,
  };
  const layoutContent = (
    <div>
      <HeaderItems testId={testId && `${testId}-header`} {...headerProps} />
      <Content
        testId={testId && `${testId}-content`}
        isDisabled={isSaving || isError}
      >
        {content}
      </Content>
      <FooterItems testId={testId && `${testId}-footer`} {...footerProps} />
      {afterContent}
    </div>
  );

  return (
    <CommentLayout
      testId={testId}
      shouldRenderNestedCommentsInline={shouldRenderNestedCommentsInline}
      id={id}
      avatar={avatar}
      content={layoutContent}
      highlighted={highlighted}
    >
      {children}
    </CommentLayout>
  );
};

export default Comment;

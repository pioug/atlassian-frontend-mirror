import React, { FC } from 'react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import Stack from '@atlaskit/primitives/stack';

import type { CommentProps } from '../types';

import Footer from './footer';
import Header from './header';
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
  headingLevel,
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
    headingLevel,
  };
  const footerProps = {
    actions,
    errorActions,
    errorIconLabel,
    isError,
    isSaving,
  };

  return (
    <CommentLayout
      testId={testId}
      shouldRenderNestedCommentsInline={shouldRenderNestedCommentsInline}
      id={id}
      avatar={avatar}
      content={
        <Stack space="075">
          <Stack space="050">
            <Header testId={testId && `${testId}-header`} {...headerProps} />
            <Text
              as="div"
              testId={testId && `${testId}-content`}
              color={isSaving || isError ? 'disabled' : 'color.text'}
            >
              {content}
            </Text>
          </Stack>
          <Footer testId={testId && `${testId}-footer`} {...footerProps} />
          {afterContent}
        </Stack>
      }
      highlighted={highlighted}
    >
      {children}
    </CommentLayout>
  );
};

Comment.displayName = 'Comment';

export default Comment;

/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CommentProps
 *
 * @codegen <<SignedSource::168060fac6a0765d20191280e916c97d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/comment/__generated__/index.partial.tsx <<SignedSource::9088f4c0a4e9e1ec151ec5ccba0cdfd6>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformComment from '@atlaskit/comment';

type PlatformCommentProps = React.ComponentProps<typeof PlatformComment>;

export type CommentProps = Pick<
  PlatformCommentProps,
  'actions' | 'afterContent' | 'avatar' | 'children' | 'content' | 'errorIconLabel' | 'headingLevel' | 'highlighted' | 'id' | 'isError' | 'isSaving' | 'restrictedTo' | 'savingText' | 'shouldRenderNestedCommentsInline' | 'testId' | 'type'
>;

/**
 * A comment displays discussions and user feedback.
 */
export type TComment<T> = (props: CommentProps) => T;
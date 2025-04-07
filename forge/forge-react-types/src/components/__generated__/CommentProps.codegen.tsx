/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CommentProps
 *
 * @codegen <<SignedSource::ecbd850be9d8821ca6e5e96434b10f79>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/comment/index.tsx <<SignedSource::a42a431bd3b71fdfd0fe249d0fccee24>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { default as PlatformComment, CommentAuthor, CommentTime, CommentAction } from '@atlaskit/comment';

export type CommentProps = Omit<
	React.ComponentProps<typeof PlatformComment>,
	'time' | 'author' | 'edited' | 'actions' | 'errorActions'
> & {
	time?: {
		onClick?: React.ComponentProps<typeof CommentTime>['onClick'],
		text: string
	}
	author?: {
		onClick?: React.ComponentProps<typeof CommentAuthor>['onClick'],
		text: string
	}
	edited?: string
	actions?: Array<{
		onClick?: React.ComponentProps<typeof CommentAction>['onClick'],
		text: string
	}>
	errorActions?: Array<{
		onClick?: React.ComponentProps<typeof CommentAction>['onClick'],
		text: string
	}>
}

export type TComment<T> = (props: CommentProps) => T;
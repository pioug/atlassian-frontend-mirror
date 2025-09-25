/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SectionMessageProps
 *
 * @codegen <<SignedSource::08d9aec7dc84ab09fe105054828cea70>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/sectionmessage/index.tsx <<SignedSource::a94e5a0d754b50192e4aeddb4c0d8500>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformSectionMessage from '@atlaskit/section-message';

type PlatformSectionMessageProps = React.ComponentProps<typeof PlatformSectionMessage>;

export type SectionMessageProps = Pick<
	PlatformSectionMessageProps,
	'children' | 'appearance' | 'title' | 'actions' | 'testId'
>;

/**
 * A section message is used to alert users to a particular section of the screen.
 *
 * @see [SectionMessage](https://developer.atlassian.com/platform/forge/ui-kit/components/section-message/) in UI Kit documentation for more information
 */
export type TSectionMessage<T> = (props: SectionMessageProps) => T;
/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SectionMessageProps
 *
 * @codegen <<SignedSource::bfde1c401fa40e47b83746d1edd62201>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/sectionmessage/index.tsx <<SignedSource::1b0af68b04c0b042581f641fe74a9817>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformSectionMessage from '@atlaskit/section-message/message';

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
/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SectionMessageProps
 *
 * @codegen <<SignedSource::a8d8f62dc2c73c2c021e658bd7efbcd7>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/sectionmessage/__generated__/index.partial.tsx <<SignedSource::164319f578b12a9ab6d85a5bd3e4cc8a>>
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
 */
export type TSectionMessage<T> = (props: SectionMessageProps) => T;
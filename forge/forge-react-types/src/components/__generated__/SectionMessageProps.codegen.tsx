/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SectionMessageProps
 *
 * @codegen <<SignedSource::c1255003a7e00ac8b54193a00017eb1b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/sectionmessage/__generated__/index.partial.tsx <<SignedSource::dd1458a5551bb547bccc3ed9b20a0775>>
 */
import React from 'react';
import PlatformSectionMessage from '@atlaskit/section-message';

type PlatformSectionMessageProps = React.ComponentProps<typeof PlatformSectionMessage>;

export type SectionMessageProps = Pick<
  PlatformSectionMessageProps,
  'children' | 'appearance' | 'title' | 'actions' | 'testId'
>;
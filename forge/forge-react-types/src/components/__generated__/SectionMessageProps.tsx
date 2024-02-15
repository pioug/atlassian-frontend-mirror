/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SectionMessageProps
 *
 * @codegen <<SignedSource::d644301d3417b2c520616e0a763e4680>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/sectionmessage/__generated__/index.partial.tsx <<SignedSource::5bcf0707af733b4d3205db990245852b>>
 */
import React from 'react';
import PlatformSectionMessage from '@atlaskit/section-message';

type PlatformSectionMessageProps = React.ComponentProps<typeof PlatformSectionMessage>;

export type SectionMessageProps = Pick<
  PlatformSectionMessageProps,
  'children' | 'appearance' | 'title' | 'actions' | 'testId'
>;
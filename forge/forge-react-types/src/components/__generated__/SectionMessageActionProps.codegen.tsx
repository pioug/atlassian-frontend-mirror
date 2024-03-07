/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SectionMessageActionProps
 *
 * @codegen <<SignedSource::cf4ea8408f382a671f67671cc3891543>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/sectionmessage/__generated__/action.partial.tsx <<SignedSource::b09d1a8697721ad9e7fd9ae5e6cf0236>>
 */
import React from 'react';
import { SectionMessageAction as PlatformSectionMessageAction } from '@atlaskit/section-message';

type PlatformSectionMessageActionProps = React.ComponentProps<typeof PlatformSectionMessageAction>;

export type SectionMessageActionProps = Pick<
  PlatformSectionMessageActionProps,
  'children' | 'onClick' | 'href' | 'testId'
>;
/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SectionMessageActionProps
 *
 * @codegen <<SignedSource::ab11a51a3690fa011af0e731fefeb84d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/sectionmessage/__generated__/action.partial.tsx <<SignedSource::ddcd2afa9bbcb5ab6a9fb4b88f31f0cd>>
 */
import React from 'react';
import { SectionMessageAction as PlatformSectionMessageAction } from '@atlaskit/section-message';

type PlatformSectionMessageActionProps = React.ComponentProps<typeof PlatformSectionMessageAction>;

export type SectionMessageActionProps = Pick<
  PlatformSectionMessageActionProps,
  'children' | 'onClick' | 'href' | 'testId'
>;
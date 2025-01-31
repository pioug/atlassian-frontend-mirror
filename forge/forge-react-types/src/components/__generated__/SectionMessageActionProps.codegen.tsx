/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SectionMessageActionProps
 *
 * @codegen <<SignedSource::ec58a4fcf2dc9bef11c61ab8aa605d64>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/sectionmessage/__generated__/action.partial.tsx <<SignedSource::50b24e38b69e96bf0beef119eeba8b2f>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { SectionMessageAction as PlatformSectionMessageAction } from '@atlaskit/section-message';

type PlatformSectionMessageActionProps = React.ComponentProps<typeof PlatformSectionMessageAction>;

export type SectionMessageActionProps = Pick<
  PlatformSectionMessageActionProps,
  'children' | 'onClick' | 'href' | 'testId'
>;

/**
 * A section message is used to alert users to a particular section of the screen.
 */
export type TSectionMessageAction<T> = (props: SectionMessageActionProps) => T;
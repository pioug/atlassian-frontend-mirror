/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SectionMessageActionProps
 *
 * @codegen <<SignedSource::419a6b3f607770bc68157b2170194c12>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/sectionmessage/__generated__/action.partial.tsx <<SignedSource::847d8dc2a319d4cd39a181f627a35cec>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformSectionMessageAction from '@atlaskit/section-message/message-action';

type PlatformSectionMessageActionProps = React.ComponentProps<typeof PlatformSectionMessageAction>;

export type SectionMessageActionProps = Pick<
  PlatformSectionMessageActionProps,
  'children' | 'onClick' | 'href' | 'testId'
>;

/**
 * A section message is used to alert users to a particular section of the screen.
 *
 * @see [SectionMessageAction](https://developer.atlassian.com/platform/forge/ui-kit/components/section-message/#section-message-action) in UI Kit documentation for more information
 */
export type TSectionMessageAction<T> = (props: SectionMessageActionProps) => T;
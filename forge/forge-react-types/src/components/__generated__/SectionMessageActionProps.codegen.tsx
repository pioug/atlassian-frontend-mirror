/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SectionMessageActionProps
 *
 * @codegen <<SignedSource::535aedc26590b8298d524a3c3a8e7874>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/sectionmessage/__generated__/action.partial.tsx <<SignedSource::d1a01b35cd5553fd5ac911fb1341b920>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { SectionMessageAction as PlatformSectionMessageAction } from '@atlaskit/section-message';

type PlatformSectionMessageActionProps = React.ComponentProps<typeof PlatformSectionMessageAction>;

export type SectionMessageActionProps = Pick<
  PlatformSectionMessageActionProps,
  'children' | 'onClick' | 'href' | 'testId'
>;
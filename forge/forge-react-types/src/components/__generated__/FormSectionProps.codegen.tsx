/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormSectionProps
 *
 * @codegen <<SignedSource::a2a46087196846cadfa4dc479f4d36d3>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/form-section.partial.tsx <<SignedSource::e901def8fd4da4f10ccb7c5b7cbc1aba>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { FormSection as PlatformFormSection } from '@atlaskit/form/form-section';

type PlatformFormSectionProps = React.ComponentProps<typeof PlatformFormSection>;

export type FormSectionProps = Pick<
  PlatformFormSectionProps,
  'title' | 'children' | 'description'
>;

/**
 * Use a form section to group related information together, so that longer forms are easier to understand.
 * There can be multiple form sections in one form.
 *
 * @see [FormSection](https://developer.atlassian.com/platform/forge/ui-kit/components/form/#form-section) in UI Kit documentation for more information
 */
export type TFormSection<T> = (props: FormSectionProps) => T;
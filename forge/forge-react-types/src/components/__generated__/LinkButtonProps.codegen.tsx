/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LinkButtonProps
 *
 * @codegen <<SignedSource::ef43d427db627d4e1c35b8f1b8521cb4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/button/__generated__/link-button.partial.tsx <<SignedSource::fd0bd6d1219654fd8b95819773f0d975>>
 */
import type { LinkButtonProps as PlatformLinkButtonProps } from '@atlaskit/button/new';
import React from 'react';

export type LinkButtonProps = Pick<PlatformLinkButtonProps, 'children' | 'target' | 'autoFocus' | 'isDisabled' | 'isSelected' | 'onBlur' | 'onClick' | 'onFocus' | 'spacing' | 'testId' | 'shouldFitContainer' | 'appearance'> & {
  href?: string
  ref?: React.Ref<HTMLAnchorElement>
};
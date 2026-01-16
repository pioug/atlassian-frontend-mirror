/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalProps
 *
 * @codegen <<SignedSource::8b63ca59b5ca961ff45b56f3e027461e>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/index.tsx <<SignedSource::d55078b8390dc6de58ffa9088dc9ede6>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformModalDialog from '@atlaskit/modal-dialog';

type PlatformModalDialogProps = React.ComponentProps<typeof PlatformModalDialog>;

export type ModalProps = Pick<
	PlatformModalDialogProps,
	| 'autoFocus'
	| 'children'
	| 'height'
	| 'width'
	| 'onClose'
	| 'shouldScrollInViewport'
	| 'label'
	| 'testId'
> & {
	/** Icon URL to display next to the title only if title is supplied. Fallback is no icon. */
	icon?: string;
	/** Title for the modal header. If supplied, we will render a ModalHeader with a ModalTitle for them. Fallback to app name if not supplied for fullscreen modals. */
	title?: string;
};

/**
 * A modal dialog displays content that requires user interaction, in a layer above the page.
 *
 * @see [Modal](https://developer.atlassian.com/platform/forge/ui-kit/components/modal/) in UI Kit documentation for more information
 */
export type TModal<T> = (props: ModalProps) => T;
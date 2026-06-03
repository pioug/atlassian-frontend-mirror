/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalProps
 *
 * @codegen <<SignedSource::97fb5a3bc0832b597f29b432928ec521>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/index.tsx <<SignedSource::0e244d7372be8db170f0f1ff7932c2d4>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformModalDialog from '@atlaskit/modal-dialog';

type PlatformModalDialogProps = React.ComponentProps<typeof PlatformModalDialog>;
type ModalNamedSizes =
	| 'small'
	| 'medium'
	| 'large'
	| 'x-large'
	| 'fullscreen'
	| 'resizable';

export type ModalProps = Pick<
	PlatformModalDialogProps,
	| 'autoFocus'
	| 'children'
	| 'onClose'
	| 'shouldScrollInViewport'
	| 'label'
	| 'testId'
> & {
	/**
	 * Width of the modal. Accepts Forge named sizes ('small' | 'medium' | 'large' | 'x-large' | 'fullscreen' | 'resizable'),
	 * or any valid CSS width string (e.g. '600px', '80%') or number (e.g. 600, 800) as pixel value.
	 */
	width?: ModalNamedSizes | string | number;
	/**
	 * Height of the modal. Accepts Forge named sizes ('small' | 'medium' | 'large' | 'x-large' | 'fullscreen' | 'resizable'),
	 * or any valid CSS height string (e.g. '400px', '80vh') or number (e.g. 600, 800) as pixel value.
	 */
	height?: ModalNamedSizes | string | number;
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
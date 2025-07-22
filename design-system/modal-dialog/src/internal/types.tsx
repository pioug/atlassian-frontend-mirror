import type { KeyboardOrMouseEvent, ModalDialogProps } from '../types';

export interface InternalModalWrapperProps extends ModalDialogProps {
	/**
	 * Whether or not the modal is fullscreen, covering the entire viewport.
	 */
	isFullScreen?: boolean;
}

export interface InternalModalDialogProps extends InternalModalWrapperProps {
	/**
	 * A boolean for if the onClose is provided. We define a `noop` as our onClose
	 * at the top level, but we need to know if one is provided for the close
	 * button to be rendered.
	 */
	hasProvidedOnClose: boolean;
	onClose: (value: KeyboardOrMouseEvent) => void;
}

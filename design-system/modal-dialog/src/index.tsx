export { default } from './modal-dialog';
export { default as ModalTransition } from './modal-transition';
export type {
	KeyboardOrMouseEvent,
	Appearance,
	ModalDialogProps,
	OnCloseHandler,
	OnCloseCompleteHandler,
	OnOpenCompleteHandler,
	OnStackChangeHandler,
} from './types';
export type { ModalAttributes } from './internal/context';

export { default as ModalHeader, type ModalHeaderProps } from './modal-header';
export { default as ModalTitle, type ModalTitleProps } from './modal-title';
export { default as ModalBody, type ModalBodyProps } from './modal-body';
export { default as ModalFooter, type ModalFooterProps } from './modal-footer';

export { CloseButton } from './close-button';

export { useModal } from './hooks';

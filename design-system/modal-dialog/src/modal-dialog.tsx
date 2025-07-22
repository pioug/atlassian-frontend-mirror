import React from 'react';

import InternalModalWrapper, { type ModalDialogProps } from './internal/components/modal-wrapper';

export type { ModalDialogProps };

export default function ModalWrapper(props: ModalDialogProps) {
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	return <InternalModalWrapper {...props} isFullScreen={false} />;
}

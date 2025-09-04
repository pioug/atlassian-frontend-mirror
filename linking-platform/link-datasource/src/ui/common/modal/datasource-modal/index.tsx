import React, { useEffect } from 'react';

import Modal, { type ModalDialogProps } from '@atlaskit/modal-dialog';

import { useDatasourceAnalyticsEvents } from '../../../../analytics';

type DatasourceModalProps = Pick<
	ModalDialogProps,
	'testId' | 'onClose' | 'children' | 'shouldReturnFocus'
>;

const ScreenEvent = () => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	useEffect(() => {
		fireEvent('screen.datasourceModalDialog.viewed', {});
	}, [fireEvent]);

	return null;
};

export const DatasourceModal = ({
	testId,
	onClose,
	children,
	shouldReturnFocus = false,
}: DatasourceModalProps) => {
	return (
		<Modal
			testId={testId}
			onClose={onClose}
			width="calc(100% - 80px)"
			shouldScrollInViewport={true}
			shouldReturnFocus={shouldReturnFocus}
		>
			<ScreenEvent />
			{children}
		</Modal>
	);
};

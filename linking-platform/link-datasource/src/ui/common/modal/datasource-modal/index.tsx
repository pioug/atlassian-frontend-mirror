import React, { useEffect } from 'react';

import Modal from '@atlaskit/modal-dialog/modal-dialog';
import type { ModalDialogProps } from '@atlaskit/modal-dialog/types';

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
}: DatasourceModalProps): React.JSX.Element => {
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

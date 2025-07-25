import React, { useEffect } from 'react';

import Modal, { type ModalDialogProps } from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';

import { useDatasourceAnalyticsEvents } from '../../../../analytics';

type DatasourceModalProps = Pick<ModalDialogProps, 'testId' | 'onClose' | 'children'>;

const ScreenEvent = () => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	useEffect(() => {
		fireEvent('screen.datasourceModalDialog.viewed', {});
	}, [fireEvent]);

	return null;
};

export const DatasourceModal = ({ testId, onClose, children }: DatasourceModalProps) => {
	return (
		<Modal
			testId={testId}
			onClose={onClose}
			width="calc(100% - 80px)"
			shouldScrollInViewport={true}
			shouldReturnFocus={fg('navx-1180-sllv-return-focus-on-escape') ? true : false}
		>
			<ScreenEvent />
			{children}
		</Modal>
	);
};

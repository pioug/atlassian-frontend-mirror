import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { ConfirmationDialogProps } from '@atlaskit/editor-common/types';
import { ModalTransition } from '@atlaskit/modal-dialog';

import { CheckboxModal } from './CheckboxModal';
import { SimpleModal } from './SimpleModal';

const ConfirmationModalImpl = (props: ConfirmationDialogProps & WrappedComponentProps) => {
	const { options } = props;

	const renderModel = (isReferentialityDialog: boolean = false) =>
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		isReferentialityDialog ? <CheckboxModal {...props} /> : <SimpleModal {...props} />;

	return options ? (
		<ModalTransition>{renderModel(options?.isReferentialityDialog)}</ModalTransition>
	) : null;
};

export const ConfirmationModal = injectIntl(ConfirmationModalImpl);

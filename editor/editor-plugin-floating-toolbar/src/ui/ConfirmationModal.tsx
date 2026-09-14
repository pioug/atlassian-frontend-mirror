import React from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import type { ConfirmationDialogProps } from '@atlaskit/editor-common/types';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

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

// eslint-disable-next-line @typescript-eslint/no-restricted-types
export const ConfirmationModal: React.FC<
	WithIntlProps<ConfirmationDialogProps & WrappedComponentProps>
> & {
	WrappedComponent: React.ComponentType<ConfirmationDialogProps & WrappedComponentProps>;
} = injectIntl(ConfirmationModalImpl);

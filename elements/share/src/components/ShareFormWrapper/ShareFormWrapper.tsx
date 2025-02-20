import React, { type ReactNode } from 'react';

import { useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import { messages } from '../../i18n';
import { type ShareDialogWithTriggerProps } from '../../types';
import { type IntegrationMode } from '../../types/ShareEntities';
import { ShareHeader } from '../ShareHeader';

import {
	InlineDialogContentWrapper as InlineDialogContentWrapperCompiled,
	InlineDialogFormWrapper as InlineDialogFormWrapperCompiled,
} from './compiled';
import { InlineDialogContentWrapper, InlineDialogFormWrapper } from './styled';

export type ShareFormWrapperProps = Pick<ShareDialogWithTriggerProps, 'shareFormTitle'> & {
	shouldShowTitle?: boolean;
	children?: ReactNode;
	footer?: ReactNode;
	integrationMode?: IntegrationMode;
	isMenuItemSelected?: boolean;
};

const ShareFormWrapper = ({
	shareFormTitle,
	shouldShowTitle,
	children = null,
	footer = null,
	integrationMode = 'off',
	isMenuItemSelected = false,
}: ShareFormWrapperProps) => {
	const { formatMessage } = useIntl();

	const ContentWrapper = fg('share-compiled-migration')
		? InlineDialogContentWrapperCompiled
		: InlineDialogContentWrapper;
	const FormWrapper = fg('share-compiled-migration')
		? InlineDialogFormWrapperCompiled
		: InlineDialogFormWrapper;

	return (
		<ContentWrapper label={formatMessage(messages.formTitle)}>
			<FormWrapper integrationMode={integrationMode} isMenuItemSelected={isMenuItemSelected}>
				{shouldShowTitle && <ShareHeader title={shareFormTitle} />}
				{children}
			</FormWrapper>
			{footer}
		</ContentWrapper>
	);
};

export default ShareFormWrapper;

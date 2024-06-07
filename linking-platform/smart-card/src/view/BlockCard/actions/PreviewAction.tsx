import React, { type ErrorInfo } from 'react';
import { FormattedMessage } from 'react-intl-next';

import { type AnalyticsFacade } from '../../../state/analytics';
import { type ActionProps } from '../components/Action';
import { type IconProps } from '../../common/Icon';
import { type MetadataProps } from '../../common/Metadata';
import { messages } from '../../../messages';
import { type AnalyticsOrigin } from '../../../utils/types';
import { openEmbedModal } from '../../EmbedModal/utils';

/*
Most of these are optional as we are being fault-tolerant
However src, details, icon, title, and providerName are STRONGLY encouraged
*/
type PreviewInfo = {
	src?: string;
	testId?: string;
	details?: Array<MetadataProps>;
	icon?: IconProps;
	url?: string;
	title?: string;
	providerName?: string;
	download?: string;
	byline?: React.ReactNode;
	onViewActionClick?: () => void;
	onDownloadActionClick?: () => void;
	onOpen?: () => void;
	onOpenFailed?: (error: Error, errorInfo: ErrorInfo) => void;
	analytics: AnalyticsFacade;
	origin?: AnalyticsOrigin;
	isSupportTheming?: boolean;
	extensionKey?: string;
};

export default ({ details, ...rest }: PreviewInfo): ActionProps => ({
	id: 'preview-content',
	text: <FormattedMessage {...messages.preview_improved} />,
	promise: () =>
		openEmbedModal({
			providerName: 'Preview',
			showModal: true,
			onClose: () => {},
			...rest,
		}),
});

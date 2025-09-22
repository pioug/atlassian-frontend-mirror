import { type ErrorInfo } from 'react';

import { type FireEventFunction } from '../../common/analytics/types';
import { type Icon } from '../../state/flexible-ui-context/types';
import { type InvokeClientActionProps } from '../../state/hooks/use-invoke-client-action/types';

import { type WithAnalytics } from './components/analytics/types';

export enum EmbedModalSize {
	Large = 'large',
	Small = 'small',
}

export type EmbedModalContext = {
	duration?: number;
	size: EmbedModalSize;
};

export type EmbedModalProps = {
	/* The extension key */
	extensionKey?: string;
	/* A function to dispatch analytics event */
	fireEvent?: FireEventFunction;
	/* The name of the iframe, if you need that for an external reference */
	iframeName: string;
	/* A download link action to invoke with useInvokeClientAction */
	invokeDownloadAction?: InvokeClientActionProps;
	/* An open link action to invoke with useInvokeClientAction */
	invokeViewAction?: InvokeClientActionProps;
	/* Determines if the blanket behind the modal should be hidden when the preview action is clicked */
	isBlanketHidden?: boolean;
	/* Determines whether modal is being opened from within preview panel */
	isInPreviewPanel?: boolean;
	// /* It determines whether a link source supports different design theme modes */
	isSupportTheming?: boolean;
	/* A flag that determines whether link source can be trusted in iframe */
	isTrusted?: boolean;
	/* A link icon */
	linkIcon?: Icon;
	/* Add responses to the modal being closed */
	onClose: (context: EmbedModalContext) => void;
	/* Called once the modal has finished opening - things such as dropbox want
	 * an iframe with an `iframeName` that they will add src to. You should likely
	 * only have src OR onOpen */
	onOpen?: (context: EmbedModalContext) => void;
	/* Called if the modal failed to open */
	onOpenFailed?: (error: Error, errorInfo: ErrorInfo) => void;
	/* Hook for when resize button is clicked */
	onResize?: (context: EmbedModalContext) => void;
	/* Name of the provider, used in the link out to the document. */
	providerName?: string;
	/* Toggle whether to show the modal or not */
	showModal?: boolean;
	/* Size of the modal used in an experiment */
	size?: EmbedModalSize;
	/* URL used to load iframe */
	src?: string;
	/* For testing purposes */
	testId?: string;
	/* The title of the document - this is displayed as a heading */
	title?: string;
	/* If you are not providing src, you should still provide a url, allowing people to access the page where the document is */
	url?: string;
} & WithAnalytics;

import { useEffect } from 'react';

import useResolve from '../../state/hooks/use-resolve';

interface UseEmbedResolvePostMessageListenerProps {
	url: string;
	embedIframeRef: React.ForwardedRef<HTMLIFrameElement>;
}

export const useEmbedResolvePostMessageListener = ({
	url,
	embedIframeRef,
}: UseEmbedResolvePostMessageListenerProps) => {
	const resolve = useResolve();

	useEffect(() => {
		const messageCallback = (event: MessageEvent) => {
			if (typeof embedIframeRef === 'function') {
				return;
			}
			const isFromExpectedIframe =
				embedIframeRef && event.source === embedIframeRef.current?.contentWindow;
			if (event.data === 'force-resolve-smart-link' && isFromExpectedIframe) {
				resolve(url, true);
			}
		};

		window.addEventListener('message', messageCallback);
		return () => {
			window.removeEventListener('message', messageCallback);
		};
	}, [resolve, url, embedIframeRef]);
};

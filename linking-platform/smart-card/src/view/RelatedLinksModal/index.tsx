import React, { useCallback, useEffect, useState } from 'react';

import { unstable_batchedUpdates } from 'react-dom';

import { extractLink } from '@atlaskit/link-extractors';
import {
	type ErrorResponse,
	type SuccessResponse,
	useSmartLinkContext,
} from '@atlaskit/link-provider';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import useIncomingOutgoingAri from '../../state/hooks/use-incoming-outgoing-links';
import useResponse from '../../state/hooks/use-response';

import RelatedLinksBaseModal from './components/RelatedLinksBaseModal';
import { type RelatedLinksModalProps } from './types';
import RelatedLinksErroredView from './views/errored';
import RelatedLinksResolvedView from './views/resolved';
import RelatedLinksResolvingView from './views/resolving';
import RelatedLinksUnavailableView from './views/unavailable';

const isGrantedResponse = (
	response: SuccessResponse | ErrorResponse,
): response is SuccessResponse => {
	return 'body' in response && response.body.meta?.access === 'granted';
};

const RelatedLinksModal = ({
	onClose,
	showModal,
	ari,
	baseUriWithNoTrailingSlash,
}: RelatedLinksModalProps): React.JSX.Element => {
	const RELATED_LINKS_LENGTH = 5;
	const { getIncomingOutgoingAris } = useIncomingOutgoingAri(baseUriWithNoTrailingSlash);
	const { connections } = useSmartLinkContext();
	const { handleResolvedLinkResponse } = useResponse();
	const { fireEvent } = useAnalyticsEvents();

	const [incomingLinks, setIncomingLinks] = useState<string[]>([]);
	const [outgoingLinks, setOutgoingLinks] = useState<string[]>([]);
	const [modalStatus, setModalStatus] = useState<'loading' | 'error' | 'resolved' | 'unavailable'>(
		'loading',
	);

	/**
	 * resolves the given ARIs to JSONLD and stores in store using the url present in the JSONLD
	 * on successful resolve, it takes the url from the response and dispatches a resolve action
	 * on a fail resolve, it is ignored as dispatch error takes in an url that we do not have
	 */
	const resolveAris = useCallback(
		async (aris: string[]): Promise<string[]> => {
			if (aris.length === 0) {
				return [];
			}
			const urlArray: string[] = [];
			const batchResponse = await connections.client.fetchDataAris(aris);
			for (const res of batchResponse) {
				if (!isGrantedResponse(res)) {
					continue;
				}
				if (!res.body.data) {
					continue;
				}
				const url = 'url' in res.body.data && extractLink(res.body.data);
				if (!url) {
					continue;
				}
				handleResolvedLinkResponse(url, res.body, false, false);
				urlArray.push(url);
			}
			return urlArray;
		},
		[connections.client, handleResolvedLinkResponse],
	);

	/**
	 * Gets incoming outgoing ARI's for the given ARI and resolves them to JSONLD
	 * throws when request to both incoming and outgoing requests error out
	 */
	const fetchIncomingOutgoingData = useCallback(async () => {
		const { incomingAris, outgoingAris } = await getIncomingOutgoingAris(ari);
		let incomingRejected = false;
		let outGoingRejected = false;

		const [incomingUrls, outgoingUrls] = await Promise.all([
			resolveAris(incomingAris).catch(() => {
				incomingRejected = true;
			}),
			resolveAris(outgoingAris).catch(() => {
				outGoingRejected = true;
			}),
		]);

		if (incomingRejected && outGoingRejected) {
			throw new Error('both incoming and outgoing resolve request were rejected');
		}

		return { incomingUrls: incomingUrls ?? [], outgoingUrls: outgoingUrls ?? [] };
	}, [ari, getIncomingOutgoingAris, resolveAris]);

	useEffect(() => {
		if (!ari) {
			setModalStatus('error');
			fireEvent('operational.relatedLinks.failed', { reason: 'ARI empty' });
			return;
		}
		fetchIncomingOutgoingData()
			.then(({ incomingUrls, outgoingUrls }) => {
				//Need either one of incoming/outgoing to have item(s) to be resolved
				if (incomingUrls.length + outgoingUrls.length) {
					// we are only rendering the first 5 links that are returned from our request
					unstable_batchedUpdates(() => {
						setIncomingLinks(incomingUrls.slice(0, RELATED_LINKS_LENGTH));
						setOutgoingLinks(outgoingUrls.slice(0, RELATED_LINKS_LENGTH));
					});
					setModalStatus('resolved');
				} else {
					// if no links are found then render unavailable view
					setModalStatus('unavailable');
				}
				fireEvent('operational.relatedLinks.success', {
					incomingCount: incomingUrls.length,
					outgoingCount: outgoingUrls.length,
				});
			})
			.catch((_error) => {
				setModalStatus('error');
				fireEvent('operational.relatedLinks.failed', { reason: 'Failed to fetch related links' });
			});
	}, [
		ari,
		connections.client,
		fetchIncomingOutgoingData,
		fireEvent,
		getIncomingOutgoingAris,
		handleResolvedLinkResponse,
	]);

	const renderView = () => {
		switch (modalStatus) {
			case 'error':
				return <RelatedLinksErroredView />;
			case 'resolved':
				return (
					<RelatedLinksResolvedView incomingLinks={incomingLinks} outgoingLinks={outgoingLinks} />
				);
			case 'unavailable':
				return <RelatedLinksUnavailableView />;

			default:
				return <RelatedLinksResolvingView />;
		}
	};

	return (
		<RelatedLinksBaseModal onClose={onClose} showModal={showModal}>
			{renderView()}
		</RelatedLinksBaseModal>
	);
};

export default RelatedLinksModal;

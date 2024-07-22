import React, { useCallback, useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import { extractLink } from '@atlaskit/link-extractors';
import {
	type ErrorResponse,
	type SuccessResponse,
	useSmartLinkContext,
} from '@atlaskit/link-provider';

import RelatedLinksBaseModal from './components/RelatedLinksBaseModal';
import RelatedLinksResolvedView from './views/resolved';
import RelatedLinksResolvingView from './views/resolving';
import RelatedLinksErroredView from './views/errored';
import RelatedLinksUnavailableView from './views/unavailable';
import useIncomingOutgoingAri from '../../state/hooks/use-incoming-outgoing-links';
import useResponse from '../../state/hooks/use-response';
import { type RelatedLinksModalProps } from './types';

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
}: RelatedLinksModalProps) => {
	const RELATED_LINKS_LENGTH = 5;
	const { getIncomingOutgoingAris } = useIncomingOutgoingAri(baseUriWithNoTrailingSlash);
	const { connections } = useSmartLinkContext();
	const { handleResolvedLinkResponse } = useResponse();

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
		let outGoinRejected = false;

		const [incomingUrls, outgoingUrls] = await Promise.all([
			resolveAris(incomingAris).catch(() => {
				incomingRejected = true;
			}),
			resolveAris(outgoingAris).catch(() => {
				outGoinRejected = true;
			}),
		]);

		if (incomingRejected && outGoinRejected) {
			throw new Error('both incoming and outgoing resolve request were rejected');
		}

		return { incomingUrls: incomingUrls ?? [], outgoingUrls: outgoingUrls ?? [] };
	}, [ari, getIncomingOutgoingAris, resolveAris]);

	useEffect(() => {
		if (!ari) {
			setModalStatus('error');
			return;
		}
		fetchIncomingOutgoingData()
			.then(({ incomingUrls, outgoingUrls }) => {
				//Need either one of incoming/outgoing to have item(s) to be resolved
				if (incomingUrls.length + outgoingUrls.length) {
					// we are only rendering the first 5 links that are returned from our request
					unstable_batchedUpdates(() => {
						setIncomingLinks(incomingUrls.splice(0, RELATED_LINKS_LENGTH));
						setOutgoingLinks(outgoingUrls.splice(0, RELATED_LINKS_LENGTH));
					});
					setModalStatus('resolved');
				} else {
					// if no links are found then render unavailable view
					setModalStatus('unavailable');
				}
			})
			.catch((_error) => {
				setModalStatus('error');
			});
	}, [
		ari,
		connections.client,
		fetchIncomingOutgoingData,
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

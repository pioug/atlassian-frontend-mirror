import React from 'react';

import { handleClickCommon } from '../common/utils';
import { CardLinkView } from '../LinkView';

import { type BlockCardProps } from './types';
import ErroredView from './views/ErroredView';
import ForbiddenView from './views/ForbiddenView';
import NotFoundView from './views/NotFoundView';
import ResolvedView from './views/ResolvedView';
import UnauthorisedView from './views/UnauthorisedView';

export const BlockCard = ({
	id,
	url,
	cardState,
	authFlow,
	handleAuthorize,
	handleFrameClick,
	renderers,
	isSelected,
	onResolve,
	onError,
	testId,
	actionOptions,
}: BlockCardProps) => {
	const { status } = cardState;

	const blockCardProps = {
		id,
		cardState,
		url,
		testId,
		onClick: (event: React.MouseEvent) => handleClickCommon(event, handleFrameClick),
		onError,
		onResolve,
		renderers,
		actionOptions,
	};

	switch (status) {
		case 'pending':
		case 'resolving':
			return <ResolvedView {...blockCardProps} testId="smart-block-resolving-view" />;
		case 'resolved':
			return <ResolvedView {...blockCardProps} />;
		case 'unauthorized':
			return <UnauthorisedView {...blockCardProps} onAuthorize={handleAuthorize} />;
		case 'forbidden':
			return <ForbiddenView {...blockCardProps} onAuthorize={handleAuthorize} />;
		case 'not_found':
			return <NotFoundView {...blockCardProps} onAuthorize={handleAuthorize} />;
		case 'fallback':
		case 'errored':
		default:
			if (onError) {
				onError({ url, status });
			}
			if (authFlow && authFlow === 'disabled') {
				return (
					<CardLinkView
						link={url}
						isSelected={isSelected}
						onClick={handleFrameClick}
						testId={`${testId}-${status}`}
					/>
				);
			}
			return <ErroredView {...blockCardProps} onAuthorize={handleAuthorize} />;
	}
};

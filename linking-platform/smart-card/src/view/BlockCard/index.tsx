import React, { PropsWithChildren } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import UFOHoldLoad from '@atlaskit/react-ufo/load-hold';

import { useControlDataExportConfig } from '../../state/hooks/use-control-data-export-config';
import { getIsDataExportEnabled } from '../../utils/should-data-export';
import { handleClickCommon } from '../common/utils';
import { CardLinkView } from '../LinkView';

import { type BlockCardProps } from './types';
import ErroredView from './views/ErroredView';
import ForbiddenView from './views/ForbiddenView';
import NotFoundView from './views/NotFoundView';
import ResolvedView from './views/ResolvedView';
import UnauthorisedView from './views/UnauthorisedView';

const UFOLoadHoldWrapper = ({ children }: PropsWithChildren) => {
	return fg('platform_renderer_blindspots') ? (
		<>
			<UFOHoldLoad name="smart-card-block-card" />
			{children}
		</>
	) : (
		children
	);
};

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
	CompetitorPrompt,
	hideIconLoadingSkeleton,
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
		CompetitorPrompt,
		hideIconLoadingSkeleton,
	};

	const { shouldControlDataExport = false } = useControlDataExportConfig();

	switch (status) {
		case 'pending':
		case 'resolving':
			return (
				<UFOLoadHoldWrapper>
					<ResolvedView {...blockCardProps} testId="smart-block-resolving-view" />
				</UFOLoadHoldWrapper>
			);
		case 'resolved':
			if (fg('platform_smart_links_controlled_dsp_export_view')) {
				if (getIsDataExportEnabled(shouldControlDataExport, cardState.details)) {
					return <UnauthorisedView {...blockCardProps} onAuthorize={handleAuthorize} />;
				}
			}

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

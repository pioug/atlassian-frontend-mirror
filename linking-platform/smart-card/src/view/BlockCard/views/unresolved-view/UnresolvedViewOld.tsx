import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import FlexibleCard from '../../../FlexibleCard';
import {
	CustomBlock,
	InternalFooterBlock,
	PreviewBlock,
	TitleBlock,
} from '../../../FlexibleCard/components/blocks';
import {
	FlexibleCardUiOptions,
	FooterBlockOptionsOld,
	PreviewBlockOptions,
	titleBlockOptionsOld,
} from '../utils';

import { type UnresolvedViewProps } from './types';

const customBlockStyles = css({
	alignItems: 'flex-start',
});

const UnresolvedViewOld = ({
	actions,
	cardState,
	children,
	onAuthorize,
	onClick,
	onError,
	showPreview = false,
	testId,
	title,
	url,
}: UnresolvedViewProps) => (
	<FlexibleCard
		appearance="block"
		cardState={cardState}
		onAuthorize={onAuthorize}
		onClick={onClick}
		onError={onError}
		origin="smartLinkCard"
		testId={testId}
		ui={FlexibleCardUiOptions}
		url={url}
	>
		<TitleBlock {...titleBlockOptionsOld} hideIcon={!!title} text={title} />
		<CustomBlock overrideCss={customBlockStyles}>{children}</CustomBlock>
		{showPreview && <PreviewBlock {...PreviewBlockOptions} />}
		<InternalFooterBlock
			{...FooterBlockOptionsOld}
			actions={actions}
			testId="smart-block-card-footer"
		/>
	</FlexibleCard>
);

export default UnresolvedViewOld;

import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
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
	FooterBlockOptions,
	PreviewBlockOptions,
	titleBlockOptions,
} from '../utils';

import { type UnresolvedViewProps } from './types';

const customBlockStyles = css({
	alignItems: 'flex-start',
});

const UnresolvedView = ({
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
		<TitleBlock {...titleBlockOptions} hideIcon={!!title} text={title} />
		<CustomBlock overrideCss={customBlockStyles}>{children}</CustomBlock>
		{showPreview && <PreviewBlock {...PreviewBlockOptions} />}
		<InternalFooterBlock
			{...FooterBlockOptions}
			actions={actions}
			testId="smart-block-card-footer"
		/>
	</FlexibleCard>
);

export default UnresolvedView;

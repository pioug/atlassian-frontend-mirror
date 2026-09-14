/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useMemo } from 'react';

import { css, jsx } from '@compiled/react';

import { browser } from '@atlaskit/linking-common/user-agent';
import { token } from '@atlaskit/tokens';

import FlexibleCard from '../../../FlexibleCard';
import { default as CustomBlock } from '../../../FlexibleCard/components/blocks/block';
import { default as InternalFooterBlock } from '../../../FlexibleCard/components/blocks/footer-block/resolved';
import { default as PreviewBlock } from '../../../FlexibleCard/components/blocks/preview-block';
import { default as TitleBlock } from '../../../FlexibleCard/components/blocks/title-block';
import { FlexibleCardUiOptions, PreviewBlockOptions, titleBlockOptions } from '../utils';

import { type UnresolvedViewProps } from './types';

const customBlockStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'> div': {
		marginTop: 0,
		color: token('color.text'),
	},
	gap: token('space.050'),
	display: 'flex',
	alignItems: 'flex-start',
	alignSelf: 'stretch',
});

const titleBlockCss = css({
	gap: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
		color: token('color.link'),
	},
});

const footerBlockCss = css({
	height: '1.5rem',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'flex-end',
	alignSelf: 'stretch',
});

const footerBlockSafariStyles = css({
	height: '100%',
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
	CompetitorPrompt,
}: UnresolvedViewProps): JSX.Element => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { safari = false } = useMemo(() => browser(), []);

	return (
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
			<TitleBlock
				{...titleBlockOptions}
				hideIcon={!!title}
				text={title}
				css={[titleBlockCss]}
				CompetitorPrompt={CompetitorPrompt}
			/>
			<CustomBlock css={[customBlockStyles]}>{children}</CustomBlock>
			{showPreview && <PreviewBlock {...PreviewBlockOptions} />}
			<InternalFooterBlock
				css={[footerBlockCss, safari && footerBlockSafariStyles]}
				actions={actions}
				testId="smart-block-card-footer"
			/>
		</FlexibleCard>
	);
};

export default UnresolvedView;

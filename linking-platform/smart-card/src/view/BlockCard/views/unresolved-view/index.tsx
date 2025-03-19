/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { SmartLinkStatus } from '../../../../constants';
import FlexibleCard from '../../../FlexibleCard';
import {
	CustomBlock,
	InternalFooterBlock,
	PreviewBlock,
	TitleBlock,
} from '../../../FlexibleCard/components/blocks';
import { FlexibleCardUiOptions, PreviewBlockOptions, titleBlockOptions } from '../utils';

import { type UnresolvedViewProps } from './types';

const customBlockStylesOld = css({
	alignItems: 'flex-start',
});

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

const titleBlockCssOld = css({
	gap: token('space.100', '0.5em'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
	},
});

const titleBlockCss = css({
	gap: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
		color: token('color.link'),
	},
});

const footerBlockCssOld = css({
	height: '1.5rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.actions-button-group': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'button, button:hover, button:focus, button:active': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: '0.875rem',
		},
	},
});

const footerBlockCss = css({
	height: '1.5rem',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'flex-end',
	alignSelf: 'stretch',
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
		<TitleBlock
			{...titleBlockOptions}
			hideIcon={!!title}
			text={title}
			css={[fg('platform-linking-visual-refresh-v1') ? titleBlockCss : titleBlockCssOld]}
			status={cardState.status as SmartLinkStatus}
		/>
		<CustomBlock
			css={[fg('platform-linking-visual-refresh-v1') ? customBlockStyles : customBlockStylesOld]}
			status={cardState.status as SmartLinkStatus}
		>
			{children}
		</CustomBlock>
		{showPreview && (
			<PreviewBlock {...PreviewBlockOptions} status={cardState.status as SmartLinkStatus} />
		)}
		<InternalFooterBlock
			css={[fg('platform-linking-visual-refresh-v1') ? footerBlockCss : footerBlockCssOld]}
			actions={actions}
			testId="smart-block-card-footer"
			status={cardState.status as SmartLinkStatus}
		/>
	</FlexibleCard>
);

export default UnresolvedView;

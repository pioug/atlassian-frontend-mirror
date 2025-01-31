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
import UnresolvedViewOld from './UnresolvedViewOld';

const customBlockStyles = css({
	alignItems: 'flex-start',
});

const titleBlockCss = css({
	gap: token('space.100', '0.5em'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
	},
});

const footerBlockCss = css({
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
			css={titleBlockCss}
			status={cardState.status as SmartLinkStatus}
		/>
		<CustomBlock css={customBlockStyles} status={cardState.status as SmartLinkStatus}>
			{children}
		</CustomBlock>
		{showPreview && (
			<PreviewBlock {...PreviewBlockOptions} status={cardState.status as SmartLinkStatus} />
		)}
		<InternalFooterBlock
			css={footerBlockCss}
			actions={actions}
			testId="smart-block-card-footer"
			status={cardState.status as SmartLinkStatus}
		/>
	</FlexibleCard>
);

export const UnresolvedViewExported = (props: UnresolvedViewProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <UnresolvedView {...props} />;
	} else {
		return <UnresolvedViewOld {...props} />;
	}
};

export default UnresolvedViewExported;

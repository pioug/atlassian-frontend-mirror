/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { SmartLinkStatus } from '../../../../constants';
import {
	Card,
	type ElementItem,
	ElementName,
	SmartLinkPosition,
	SmartLinkSize,
	SmartLinkTheme,
	TitleBlock,
} from '../../../../index';
import { type FlexibleUiOptions } from '../../../FlexibleCard/types';
import { type RelatedLinkItemProp } from '../types';

import RelatedLinkItemOld from './RelatedLinkItemOld';

const hoverStyles = xcss({
	':hover': {
		backgroundColor: 'color.background.input.hovered',
		borderRadius: 'border.radius.100',
		marginInline: 'space.negative.100',
		paddingInline: 'space.100',
	},
});

const relatedLinkItemStyles = css({
	paddingTop: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	gap: token('space.150', '12px'),
	font: token('font.body.small'),
});

const RelatedLinkItem = ({ url, testId }: RelatedLinkItemProp) => {
	const subtitle: ElementItem[] = [{ name: ElementName.Provider, hideIcon: true }];

	const ui: FlexibleUiOptions = {
		hideElevation: true,
		hidePadding: true,
		hideBackground: true,
		theme: SmartLinkTheme.Black,
		clickableContainer: true,
		size: SmartLinkSize.Large,
	};

	return (
		<Box testId={testId} xcss={hoverStyles}>
			<Card appearance="block" ui={ui} url={url}>
				<TitleBlock
					maxLines={1}
					hideTitleTooltip={true}
					position={SmartLinkPosition.Center}
					subtitle={subtitle}
					anchorTarget="_blank"
					css={relatedLinkItemStyles}
					size={ui.size}
					theme={ui.theme}
					status={SmartLinkStatus.Resolved}
				/>
			</Card>
		</Box>
	);
};

const RelatedLinkItemExported = (props: RelatedLinkItemProp) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <RelatedLinkItem {...props} />;
	} else {
		return <RelatedLinkItemOld {...props} />;
	}
};

export default RelatedLinkItemExported;

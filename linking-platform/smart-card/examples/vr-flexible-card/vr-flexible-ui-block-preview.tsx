/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { image1 as preview } from '@atlaskit/link-test-helpers';
import { token } from '@atlaskit/tokens';

import { MediaPlacement, PreviewBlock, SmartLinkSize, SnippetBlock, TitleBlock } from '../../src';
import FlexibleCard from '../../src/view/FlexibleCard';
import { getCardState } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const blockOverrideCss = css({
	backgroundColor: token('color.background.accent.blue.subtle', '#579DFF'),
	paddingTop: token('space.200', '1rem'),
	paddingRight: token('space.200', '1rem'),
	paddingBottom: token('space.200', '1rem'),
	paddingLeft: token('space.200', '1rem'),
});

const styles = css({
	maxWidth: '400px',
});
const cardState = getCardState({
	data: {
		image: { '@type': 'Image', url: preview },
		summary:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	},
});

type Config = {
	size: SmartLinkSize;
	placement: MediaPlacement | undefined;
	ignorePadding: boolean;
};

const configurations = (size: SmartLinkSize): Config[] => {
	const configs: Config[] = [];
	for (const placement of [...Object.values(MediaPlacement), undefined]) {
		for (const ignorePadding of [true, false]) {
			configs.push({ size, placement, ignorePadding });
		}
	}
	return configs;
};

const FlexibleUiBlockPreviewDefault = ({ size }: { size: SmartLinkSize }) => {
	return (
		<VRTestWrapper>
			<SmartCardProvider>
				{configurations(size).map(
					({ size, placement, ignorePadding }: Config, idx: React.Key | undefined) => (
						<React.Fragment key={idx}>
							<div css={styles}>
								<h5>
									Size: {size}, Placement: {placement || 'Default'}, IgnoreContainerPadding:{' '}
									{ignorePadding ? 'True' : 'False'}
								</h5>
								<FlexibleCard cardState={cardState} url="link-url" ui={{ size }}>
									<TitleBlock />
									<SnippetBlock />
									<PreviewBlock placement={placement} ignoreContainerPadding={ignorePadding} />
								</FlexibleCard>
							</div>
						</React.Fragment>
					),
				)}
				<h5>Override CSS</h5>
				<FlexibleCard cardState={cardState} url="link-url">
					<PreviewBlock css={blockOverrideCss} />
				</FlexibleCard>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};

export const FlexibleUiBlockPreviewXLarge = () => (
	<FlexibleUiBlockPreviewDefault size={SmartLinkSize.XLarge} />
);
export const FlexibleUiBlockPreviewLarge = () => (
	<FlexibleUiBlockPreviewDefault size={SmartLinkSize.Large} />
);
export const FlexibleUiBlockPreviewMedium = () => (
	<FlexibleUiBlockPreviewDefault size={SmartLinkSize.Medium} />
);
export const FlexibleUiBlockPreviewSmall = () => (
	<FlexibleUiBlockPreviewDefault size={SmartLinkSize.Small} />
);

export const FlexibleUiBlockPreviewMixedPadding = () => {
	return (
		<VRTestWrapper>
			<SmartCardProvider>
				<h5>Multiple Previews with mixed padding</h5>
				<FlexibleCard cardState={cardState} url="link-url">
					<PreviewBlock />
					<TitleBlock />
					<SnippetBlock />
					<PreviewBlock placement={MediaPlacement.Left} />
					<PreviewBlock placement={MediaPlacement.Right} ignoreContainerPadding={true} />
					<PreviewBlock ignoreContainerPadding={true} />
				</FlexibleCard>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};

export const FlexibleUiBlockPreviewOverrideCSS = () => {
	return (
		<VRTestWrapper>
			<SmartCardProvider>
				<h5>Override CSS</h5>
				<FlexibleCard cardState={cardState} url="link-url">
					<PreviewBlock css={blockOverrideCss} />
				</FlexibleCard>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};

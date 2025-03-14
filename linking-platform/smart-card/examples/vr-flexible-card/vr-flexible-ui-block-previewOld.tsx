/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { MediaPlacement, PreviewBlock, SmartLinkSize, SnippetBlock, TitleBlock } from '../../src';
import FlexibleCard from '../../src/view/FlexibleCard';
import preview from '../images/rectangle.svg';
import { blockOverrideCss, getCardState } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

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

const configurations: () => Array<{
	size: SmartLinkSize;
	placement: MediaPlacement | undefined;
	ignorePadding: boolean;
}> = () => {
	let configs = [];
	for (const size of Object.values(SmartLinkSize)) {
		for (const placement of [...Object.values(MediaPlacement), undefined]) {
			for (const ignorePadding of [true, false]) {
				configs.push({ size, placement, ignorePadding });
			}
		}
	}
	return configs;
};

const Old = () => (
	<VRTestWrapper>
		<SmartCardProvider>
			{configurations().map(
				(
					{
						size,
						placement,
						ignorePadding,
					}: {
						size: SmartLinkSize;
						placement: MediaPlacement | undefined;
						ignorePadding: boolean;
					},
					idx: React.Key | undefined,
				) => (
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

			<h5>Multiple Previews with mixed padding</h5>
			<FlexibleCard cardState={cardState} url="link-url">
				<PreviewBlock />
				<TitleBlock />
				<SnippetBlock />
				<PreviewBlock placement={MediaPlacement.Left} />
				<PreviewBlock placement={MediaPlacement.Right} ignoreContainerPadding={true} />
				<PreviewBlock ignoreContainerPadding={true} />
			</FlexibleCard>

			<h5>Override CSS</h5>
			<FlexibleCard cardState={cardState} url="link-url">
				<PreviewBlock overrideCss={blockOverrideCss} />
			</FlexibleCard>
		</SmartCardProvider>
	</VRTestWrapper>
);

export default Old;

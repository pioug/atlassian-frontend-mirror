/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@atlaskit/css';
import { createStorybookMediaClientConfig, imageFileId } from '@atlaskit/media-test-helpers';
import { token } from '@atlaskit/tokens';

import { MainWrapper } from '../example-helpers';
import Card from '../src/card/cardLoader';

const GATE = 'aifc_page_create_defer_generated_visuals';

const dimensions = { width: 320, height: 240 };
const mediaClientConfig = createStorybookMediaClientConfig();

const rowStyles = css({
	display: 'flex',
	gap: token('space.400'),
	marginTop: token('space.200'),
});

const columnStyles = css({
	display: 'flex',
	flexDirection: 'column',
	gap: token('space.100'),
});

/**
 * `hasLoadingMotion` drops the card's own loading affordances — spinner, progress bar, type icon
 * and sunken background — and fades the preview in once it has rendered instead.
 *
 * It is meant for surfaces that keep the node out of the layout until the preview is ready, so
 * there is nothing for a placeholder to stand in for. In the Create with Rovo preview the editor
 * opens space for the image and this fade runs as that finishes.
 *
 * Reload the page to replay it: the fade only runs while the preview is being fetched.
 *
 * The prop is gated, so this example needs the gate turned on to show anything: use the harness's
 * "Enable feature flag" control, or append `&featureFlag=aifc_page_create_defer_generated_visuals`
 * to the URL. Forcing it from this module would not work — the harness installs its own resolver
 * from that query param after the example is evaluated.
 */
export default (): React.JSX.Element => (
	<MainWrapper>
		<h3>Card loading motion</h3>
		<p>
			Both cards load the same file. The left one expresses loading through motion, the right one
			through the usual indicator.
		</p>
		<p>
			Requires the <code>{GATE}</code> feature flag. Without it both cards render identically.
		</p>
		<div css={rowStyles}>
			<div css={columnStyles}>
				<strong>hasLoadingMotion</strong>
				<Card
					mediaClientConfig={mediaClientConfig}
					identifier={imageFileId}
					// Matches how the editor renders media single nodes.
					disableOverlay={true}
					dimensions={dimensions}
					hasLoadingMotion={true}
				/>
			</div>
			<div css={columnStyles}>
				<strong>Default</strong>
				<Card
					mediaClientConfig={mediaClientConfig}
					identifier={imageFileId}
					disableOverlay={true}
					dimensions={dimensions}
				/>
			</div>
		</div>
	</MainWrapper>
);

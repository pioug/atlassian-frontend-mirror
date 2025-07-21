/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ComponentPropsWithoutRef } from 'react';

import { css, jsx } from '@compiled/react';
import { IntlProvider } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';
import ImageLoader from 'react-render-image';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { AtlasProject, ResolvingClient } from '@atlaskit/link-test-helpers';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { Card } from '@atlaskit/smart-card';

import ImageIconWithColor from '../../src/common/ui/icons/image-icon';
import { InlineCardErroredView } from '../../src/view/InlineCard/ErroredView';
import { InlineCardForbiddenView } from '../../src/view/InlineCard/ForbiddenView';
import { InlineCardResolvedView as ResolvedView } from '../../src/view/InlineCard/ResolvedView';
import { InlineCardUnauthorizedView } from '../../src/view/InlineCard/UnauthorisedView';
import { CardLinkView } from '../../src/view/LinkView';

const ImageLoaderMock = (props: ComponentPropsWithoutRef<typeof ImageLoader>) => (
	<ImageLoader {...props} loaded={props.loading} />
);

const VRInlineCardAllExamplesInText = () => {
	return (
		<IntlProvider locale="en">
			<Box xcss={wrapperStyle}>
				<p>
					This is an example of inline cards with links breaking some more lines{' '}
					<ResolvedView
						link={'https://atlassian.design'}
						title="Smart Links - Designs"
						lozenge={{
							text: 'in progress',
							appearance: 'inprogress',
						}}
					/>
					. There is also spinning links with the spinner on the left side{' '}
					<span css={animationStyles}>
						{/* Note: Card was used here instead of the individual view component due to flakiness associated with the spinner */}
						<SmartCardProvider client={new ResolvingClient()}>
							<Card
								appearance="inline"
								url={'https://atlassian.design'}
								resolvingPlaceholder={'Resolving...'}
							/>
						</SmartCardProvider>
					</span>{' '}
					and also with spinner on the right side{' '}
					<span css={animationStyles}>
						{/* Note: Card was used here instead of the individual view component due to flakiness associated with the spinner */}
						<SmartCardProvider client={new ResolvingClient()}>
							<Card
								appearance="inline"
								url={'https://atlassian.design'}
								resolvingPlaceholder={'Resolving...'}
								inlinePreloaderStyle="on-right-without-skeleton"
							/>
						</SmartCardProvider>
					</span>
					. Some of the resolved links don't have a lozenge button{' '}
					<ResolvedView link={'some-url'} title="Link without Lozenge" />. Some links have icons
					from urls{' '}
					<ResolvedView link="some-url" icon={AtlasProject.data.icon.url} title="Link with Icon" />.
				</p>
				<p>
					The icon could also be an emoji{' '}
					<ResolvedView
						link="some-url"
						titlePrefix={'🎉'}
						title="Link with emoji"
						lozenge={{
							text: 'NEW',
							appearance: 'new',
						}}
					/>{' '}
					and also a react component{' '}
					<ResolvedView
						link="some-url"
						icon={<ImageIconWithColor label="" />}
						title="Link with component"
						lozenge={{
							text: 'DONE',
							appearance: 'success',
						}}
					/>
					, and, there is a skeleton while the image is not loaded{' '}
					<span css={animationStyles}>
						<DiProvider use={[injectable(ImageLoader, ImageLoaderMock)]}>
							<ResolvedView
								link="some-url"
								icon={AtlasProject.data.icon.url}
								title="Link with skeleton"
							/>
						</DiProvider>
					</span>
				</p>
				<p>
					The unauthorised cards are similar to resolved cards regarding the icon but has a button
					at the end{' '}
					<InlineCardUnauthorizedView icon={'/'} url={'some-url'} onAuthorise={() => {}} />. The
					same button is available in the forbidden card{' '}
					<InlineCardForbiddenView
						url={'some-url'}
						onAuthorise={() => {}}
						requestAccessContext={
							{
								callToActionMessageKey: 'forbidden_title',
							} as any
						}
					/>
					, but the forbidden one can also be disabled{' '}
					<InlineCardForbiddenView
						url={'some-url'}
						icon={<ImageIconWithColor label="" />}
						onAuthorise={() => {}}
						requestAccessContext={
							{
								accessType: 'PENDING_REQUEST_EXISTS',
								callToActionMessageKey: 'forbidden_title',
							} as any
						}
					/>
					. When a context is not passed, a lozenge is rendered instead{' '}
					<InlineCardForbiddenView
						url={'some-url'}
						icon={AtlasProject.data.icon.url}
						onAuthorise={() => {}}
					/>
				</p>
				<p>
					The not found card is similar to the unauthorised and forbidden{' '}
					<InlineCardErroredView url={'some-url'} message={'Not found'} /> but the action button is
					based on the `onRetry` prop{' '}
					<InlineCardErroredView
						icon={AtlasProject.data.icon.url}
						url={'some-url'}
						message={'Not found'}
						onRetry={() => {}}
					/>
				</p>
				<p>
					Error and fallback links used the CardLinkView{' '}
					<CardLinkView link={'some-url'} placeholder="which is a normal link" onClick={() => {}} />
				</p>
				<Box xcss={smallBoxForTruncatedStyle}>
					Truncated card{' '}
					<ResolvedView
						link="some-url"
						icon={AtlasProject.data.icon.url}
						title="this card should be truncated because its title is too long and it should not render everything that is written on it"
						truncateInline
					/>
				</Box>
			</Box>
		</IntlProvider>
	);
};

VRInlineCardAllExamplesInText.displayName = 'VRInlineCardAllExamplesInText';

export default VRInlineCardAllExamplesInText;

const wrapperStyle = xcss({
	width: '600px',
});

const smallBoxForTruncatedStyle = xcss({
	width: '200px',
});

/**
 * For VR testing purposes we are overriding the animation timing
 * for both the fade-in and the rotating animations. This will
 * freeze the spinner, avoiding potential for VR test flakiness.
 */
const animationStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'svg, span': {
		animationDuration: '0s',
		animationTimingFunction: 'step-end',
	},
});

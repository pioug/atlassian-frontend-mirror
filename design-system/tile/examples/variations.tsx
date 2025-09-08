/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useColorMode } from '@atlaskit/app-provider';
import { css, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile';

const containerStyles = css({
	maxWidth: '600px',
});

export default function Variations() {
	const colorMode = useColorMode();

	const gitHubInsetSVG = (
		<svg height="32" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="32">
			<path
				fill="#FFF"
				d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"
			></path>
		</svg>
	);

	const gitHubInsetLightSVG = (
		<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="40" height="40" fill="#F6F8FA" />
			<path
				d="M20 8.5C13.3705 8.5 8 13.777 8 20.291C8 25.508 11.4353 29.9157 16.2047 31.4774C16.8047 31.5803 17.0295 31.2277 17.0295 30.9179C17.0295 30.6371 17.0153 29.7088 17.0153 28.7216C14 29.2672 13.22 27.9991 12.98 27.3367C12.8447 26.9969 12.26 25.9507 11.7505 25.6709C11.3305 25.449 10.7295 24.9045 11.7353 24.8895C12.68 24.8745 13.3553 25.7438 13.58 26.0986C14.66 27.8812 16.3847 27.3806 17.0753 27.0708C17.18 26.3044 17.4953 25.7888 17.84 25.494C15.1695 25.1993 12.38 24.182 12.38 19.6714C12.38 18.3894 12.8447 17.3282 13.6105 16.5029C13.4895 16.2081 13.0695 15.0001 13.7305 13.3783C13.7305 13.3783 14.7353 13.0695 17.0295 14.5874C18.0063 14.3211 19.0157 14.1873 20.0295 14.1897C21.0505 14.1897 22.0705 14.3215 23.0295 14.5874C25.3247 13.0545 26.3295 13.3783 26.3295 13.3783C26.9895 15.0001 26.5705 16.2081 26.4505 16.5029C27.2153 17.3282 27.68 18.3755 27.68 19.6714C27.68 24.197 24.8753 25.1993 22.2047 25.494C22.64 25.8628 23.0153 26.5702 23.0153 27.6754C23.0153 29.2522 23 30.5202 23 30.9179C23 31.2277 23.2247 31.5953 23.8247 31.4774C28.5647 29.9157 32 25.494 32 20.291C32 13.777 26.6305 8.5 20 8.5Z"
				fill="#1F2328"
			/>
		</svg>
	);

	const gitHubInsetDarkSVG = (
		<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="40" height="40" fill="black" />
			<path
				d="M20 8.5C13.3705 8.5 8 13.777 8 20.291C8 25.508 11.4353 29.9157 16.2047 31.4774C16.8047 31.5803 17.0295 31.2277 17.0295 30.9179C17.0295 30.6371 17.0153 29.7088 17.0153 28.7216C14 29.2672 13.22 27.9991 12.98 27.3367C12.8447 26.9969 12.26 25.9507 11.7505 25.6709C11.3305 25.449 10.7295 24.9045 11.7353 24.8895C12.68 24.8745 13.3553 25.7438 13.58 26.0986C14.66 27.8812 16.3847 27.3806 17.0753 27.0708C17.18 26.3044 17.4953 25.7888 17.84 25.494C15.1695 25.1993 12.38 24.182 12.38 19.6714C12.38 18.3894 12.8447 17.3282 13.6105 16.5029C13.4895 16.2081 13.0695 15.0001 13.7305 13.3783C13.7305 13.3783 14.7353 13.0695 17.0295 14.5874C18.0063 14.3211 19.0157 14.1873 20.0295 14.1897C21.0505 14.1897 22.0705 14.3215 23.0295 14.5874C25.3247 13.0545 26.3295 13.3783 26.3295 13.3783C26.9895 15.0001 26.5705 16.2081 26.4505 16.5029C27.2153 17.3282 27.68 18.3755 27.68 19.6714C27.68 24.197 24.8753 25.1993 22.2047 25.494C22.64 25.8628 23.0153 26.5702 23.0153 27.6754C23.0153 29.2522 23 30.5202 23 30.9179C23 31.2277 23.2247 31.5953 23.8247 31.4774C28.5647 29.9157 32 25.494 32 20.291C32 13.777 26.6305 8.5 20 8.5Z"
				fill="white"
			/>
		</svg>
	);

	const gitHubNonInsetSVG = (
		<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="40" height="40" fill="#1F2328" />
			<path
				d="M20 8.5C13.3705 8.5 8 13.777 8 20.291C8 25.508 11.4353 29.9157 16.2047 31.4774C16.8047 31.5803 17.0295 31.2277 17.0295 30.9179C17.0295 30.6371 17.0153 29.7088 17.0153 28.7216C14 29.2672 13.22 27.9991 12.98 27.3367C12.8447 26.9969 12.26 25.9507 11.7505 25.6709C11.3305 25.449 10.7295 24.9045 11.7353 24.8895C12.68 24.8745 13.3553 25.7438 13.58 26.0986C14.66 27.8812 16.3847 27.3806 17.0753 27.0708C17.18 26.3044 17.4953 25.7888 17.84 25.494C15.1695 25.1993 12.38 24.182 12.38 19.6714C12.38 18.3894 12.8447 17.3282 13.6105 16.5029C13.4895 16.2081 13.0695 15.0001 13.7305 13.3783C13.7305 13.3783 14.7353 13.0695 17.0295 14.5874C18.0063 14.3211 19.0157 14.1873 20.0295 14.1897C21.0505 14.1897 22.0705 14.3215 23.0295 14.5874C25.3247 13.0545 26.3295 13.3783 26.3295 13.3783C26.9895 15.0001 26.5705 16.2081 26.4505 16.5029C27.2153 17.3282 27.68 18.3755 27.68 19.6714C27.68 24.197 24.8753 25.1993 22.2047 25.494C22.64 25.8628 23.0153 26.5702 23.0153 27.6754C23.0153 29.2522 23 30.5202 23 30.9179C23 31.2277 23.2247 31.5953 23.8247 31.4774C28.5647 29.9157 32 25.494 32 20.291C32 13.777 26.6305 8.5 20 8.5Z"
				fill="white"
			/>
		</svg>
	);

	const insetCloudSVG = (
		<svg width="33" height="23" viewBox="0 0 33 23" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M13.8077 2.44412C14.8395 1.37 16.2756 0.704854 17.8621 0.704854C19.9774 0.704854 21.8106 1.88003 22.7978 3.63104C23.674 3.23933 24.6231 3.03709 25.583 3.03758C29.3905 3.03758 32.4812 6.1518 32.4812 9.99462C32.4812 13.8375 29.3905 16.9517 25.583 16.9517C25.1176 16.9517 24.664 16.9049 24.2198 16.8165C23.356 18.356 21.7049 19.4019 19.8246 19.4019C19.0591 19.4034 18.3033 19.2298 17.6153 18.8942C16.7398 20.9508 14.7008 22.3963 12.327 22.3963C9.84735 22.3963 7.74379 20.8333 6.93291 18.6357C6.57201 18.7119 6.20415 18.7501 5.8353 18.7499C2.88561 18.7499 0.5 16.3291 0.5 13.3559C0.5 11.3581 1.57411 9.6188 3.16765 8.67866C2.82958 7.89987 2.65556 7.05979 2.65645 6.21079C2.65645 2.77928 5.44162 0.00585938 8.87313 0.00585938C10.8827 0.00585938 12.6807 0.963628 13.8089 2.45023"
				fill="#00A1E0"
			/>
		</svg>
	);

	return (
		<div css={containerStyles}>
			<Stack space="space.200">
				<div>
					<Heading size="xsmall">Default, empty tiles</Heading>
					<Inline space="space.100" alignBlock="end">
						<Tile label="" size="xxsmall" />
						<Tile label="" size="xsmall" />
						<Tile label="" size="small" />
						<Tile label="" size="medium" />
						<Tile label="" size="large" />
						<Tile label="" size="xlarge" />
					</Inline>
				</div>
				<div>
					<Heading size="xsmall">Colored tiles</Heading>
					<Inline space="space.100" alignBlock="end">
						<Tile label="" size="xxsmall" backgroundColor="color.background.accent.blue.bolder" />
						<Tile label="" size="xsmall" backgroundColor="color.background.accent.blue.bolder" />
						<Tile label="" size="small" backgroundColor="color.background.accent.purple.subtle" />
						<Tile label="" size="medium" backgroundColor="color.background.danger.bold" />
						<Tile label="" size="large" backgroundColor="color.background.discovery.bold" />
						<Tile label="" size="xlarge" backgroundColor="color.background.accent.teal.subtler" />
					</Inline>
				</div>
				<div>
					<Heading size="xsmall">Inset 3P logo with border</Heading>
					<Inline space="space.100" alignBlock="end">
						<Tile label="" size="xxsmall" backgroundColor="color.background.neutral" hasBorder>
							{insetCloudSVG}
						</Tile>
						<Tile label="" size="xsmall" backgroundColor="color.background.neutral" hasBorder>
							{insetCloudSVG}
						</Tile>
						<Tile label="" size="small" backgroundColor="color.background.neutral" hasBorder>
							{insetCloudSVG}
						</Tile>
						<Tile label="" size="medium" backgroundColor="color.background.neutral" hasBorder>
							{insetCloudSVG}
						</Tile>
						<Tile label="" size="large" backgroundColor="color.background.neutral" hasBorder>
							{insetCloudSVG}
						</Tile>
						<Tile label="" size="xlarge" backgroundColor="color.background.neutral" hasBorder>
							{insetCloudSVG}
						</Tile>
					</Inline>
				</div>
				<div>
					<Heading size="xsmall">Inset 3P logo with border - with static white background</Heading>
					<Inline space="space.100" alignBlock="end">
						<Tile label="" size="xxsmall" backgroundColor="white" hasBorder>
							{insetCloudSVG}
						</Tile>
						<Tile label="" size="xsmall" backgroundColor="white" hasBorder>
							{insetCloudSVG}
						</Tile>
						<Tile label="" size="small" backgroundColor="white" hasBorder>
							{insetCloudSVG}
						</Tile>
						<Tile label="" size="medium" backgroundColor="white" hasBorder>
							{insetCloudSVG}
						</Tile>
						<Tile label="" size="large" backgroundColor="white" hasBorder>
							{insetCloudSVG}
						</Tile>
						<Tile label="" size="xlarge" backgroundColor="white" hasBorder>
							{insetCloudSVG}
						</Tile>
					</Inline>
				</div>
				<div>
					<Heading size="xsmall">Inset 3P logo - with static black background</Heading>
					<Inline space="space.100" alignBlock="end">
						<Tile label="" size="xxsmall" backgroundColor="black">
							{gitHubInsetSVG}
						</Tile>
						<Tile label="" size="xsmall" backgroundColor="black">
							{gitHubInsetSVG}
						</Tile>
						<Tile label="" size="small" backgroundColor="black">
							{gitHubInsetSVG}
						</Tile>
						<Tile label="" size="medium" backgroundColor="black">
							{gitHubInsetSVG}
						</Tile>
						<Tile label="" size="large" backgroundColor="black">
							{gitHubInsetSVG}
						</Tile>
						<Tile label="" size="xlarge" backgroundColor="black">
							{gitHubInsetSVG}
						</Tile>
					</Inline>
				</div>
				<div>
					<Heading size="xsmall">Non-inset 3P logo - static image</Heading>
					<Inline space="space.100" alignBlock="end">
						<Tile label="" size="xxsmall" isInset={false}>
							{gitHubNonInsetSVG}
						</Tile>
						<Tile label="" size="xsmall" isInset={false}>
							{gitHubNonInsetSVG}
						</Tile>
						<Tile label="" size="small" isInset={false}>
							{gitHubNonInsetSVG}
						</Tile>
						<Tile label="" size="medium" isInset={false}>
							{gitHubNonInsetSVG}
						</Tile>
						<Tile label="" size="large" isInset={false}>
							{gitHubNonInsetSVG}
						</Tile>
						<Tile label="" size="xlarge" isInset={false}>
							{gitHubNonInsetSVG}
						</Tile>
					</Inline>
				</div>
				<div>
					<Heading size="xsmall">Themed images</Heading>
					<p>Using existing ADS theming, assets can change between light and dark mode</p>
					<Inline space="space.100" alignBlock="end">
						<Tile hasBorder label="" size="xxsmall" isInset={false}>
							{colorMode === 'light' ? gitHubInsetLightSVG : gitHubInsetDarkSVG}
						</Tile>
						<Tile hasBorder label="" size="xsmall" isInset={false}>
							{colorMode === 'light' ? gitHubInsetLightSVG : gitHubInsetDarkSVG}
						</Tile>
						<Tile hasBorder label="" size="small" isInset={false}>
							{colorMode === 'light' ? gitHubInsetLightSVG : gitHubInsetDarkSVG}
						</Tile>
						<Tile hasBorder label="" size="medium" isInset={false}>
							{colorMode === 'light' ? gitHubInsetLightSVG : gitHubInsetDarkSVG}
						</Tile>
						<Tile hasBorder label="" size="large" isInset={false}>
							{colorMode === 'light' ? gitHubInsetLightSVG : gitHubInsetDarkSVG}
						</Tile>
						<Tile hasBorder label="" size="xlarge" isInset={false}>
							{colorMode === 'light' ? gitHubInsetLightSVG : gitHubInsetDarkSVG}
						</Tile>
					</Inline>
				</div>
			</Stack>
		</div>
	);
}

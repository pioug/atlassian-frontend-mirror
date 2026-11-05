import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group/avatar-group';
import Avatar, { type AvatarProps } from '@atlaskit/avatar/avatar';
import Heading from '@atlaskit/heading/heading';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

const toDataUri = (svg: string): string => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const evilYouTubeLogo = {
	name: 'Evil YouTube',
	src: toDataUri(`
		<svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M19.0063 0.658528C20.5278 -0.219509 22.4023 -0.21951 23.9238 0.658527L38.2624 8.93337C39.7838 9.8114 40.7211 11.4341 40.7211 13.1902V29.7398C40.7211 31.4959 39.7838 33.1186 38.2624 33.9966L23.9238 42.2715C22.4023 43.1495 20.5278 43.1495 19.0063 42.2715L4.6677 33.9966C3.14624 33.1186 2.20898 31.4959 2.20898 29.7398V13.1902C2.20898 11.4341 3.14624 9.81141 4.6677 8.93337L19.0063 0.658528Z" fill="white"/>
			<rect width="42.93" height="42.93" fill="black"/>
			<path d="M34.4946 14.9939C34.3409 14.4293 34.0379 13.9139 33.6159 13.4995C33.1939 13.085 32.6676 12.786 32.0899 12.6324C29.9697 12.0741 21.4649 12.0741 21.4649 12.0741C21.4649 12.0741 12.9602 12.0741 10.8389 12.6324C10.2614 12.7863 9.73545 13.0854 9.31365 13.4998C8.89185 13.9142 8.58898 14.4294 8.43533 14.9939C7.86646 17.0768 7.86646 21.4217 7.86646 21.4217C7.86646 21.4217 7.86646 25.7666 8.43533 27.8495C8.58897 28.4141 8.89198 28.9294 9.31401 29.3439C9.73603 29.7583 10.2623 30.0573 10.84 30.2109C12.9602 30.7693 21.4649 30.7693 21.4649 30.7693C21.4649 30.7693 29.9697 30.7693 32.091 30.2109C32.6688 30.0574 33.1951 29.7585 33.6172 29.344C34.0392 28.9295 34.3422 28.4141 34.4957 27.8495C35.0634 25.7666 35.0634 21.4217 35.0634 21.4217C35.0634 21.4217 35.0634 17.0768 34.4946 14.9939ZM18.6829 25.3663V17.477L25.7915 21.4217L18.6829 25.3663Z" fill="#FF0000"/>
		</svg>
	`),
};

const placeholderLogo = {
	name: 'Placeholder',
	src: toDataUri(`
		<svg width="48" height="52" viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg">
			<mask id="mask0_146769_977" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="52">
				<path d="M21.0493 0.790295C22.8752 -0.263431 25.1248 -0.263432 26.9507 0.790294L44.1583 10.7209C45.9842 11.7746 47.109 13.722 47.109 15.8294V35.6906C47.109 37.798 45.9842 39.7454 44.1583 40.7991L26.9507 50.7297C25.1248 51.7834 22.8752 51.7834 21.0493 50.7297L3.84159 40.7991C2.0157 39.7454 0.8909 37.798 0.8909 35.6906V15.8294C0.8909 13.722 2.0157 11.7746 3.84159 10.7209L21.0493 0.790295Z" fill="white"/>
			</mask>
			<g mask="url(#mask0_146769_977)">
				<path d="M21.0493 0.790295C22.8752 -0.263431 25.1248 -0.263432 26.9507 0.790294L44.1583 10.7209C45.9842 11.7746 47.109 13.722 47.109 15.8294V35.6906C47.109 37.798 45.9842 39.7454 44.1583 40.7991L26.9507 50.7297C25.1248 51.7834 22.8752 51.7834 21.0493 50.7297L3.84159 40.7991C2.0157 39.7454 0.8909 37.798 0.8909 35.6906V15.8294C0.8909 13.722 2.0157 11.7746 3.84159 10.7209L21.0493 0.790295Z" fill="white"/>
				<path d="M24 39.7133H17.0233V32.7367H24V39.7133Z" fill="#96999E"/>
				<path d="M37.9533 39.7133H30.9767V32.7367H37.9533V39.7133Z" fill="#96999E"/>
				<path d="M17.0233 32.7367H10.0467V25.76H17.0233V32.7367Z" fill="#96999E"/>
				<path d="M30.9767 32.7367H24V25.76H30.9767V32.7367Z" fill="#96999E"/>
				<path d="M24 25.76H17.0233V18.7833H24V25.76Z" fill="#96999E"/>
				<path d="M37.9533 25.76H30.9767V18.7833H37.9533V25.76Z" fill="#96999E"/>
				<path d="M17.0233 18.7833H10.0467V11.8067H17.0233V18.7833Z" fill="#96999E"/>
				<path d="M30.9767 18.7833H24V11.8067H30.9767V18.7833Z" fill="#96999E"/>
				<mask id="stroke0_146769_977" fill="white">
					<path d="M21.0493 0.790295C22.8752 -0.263431 25.1248 -0.263432 26.9507 0.790294L44.1583 10.7209C45.9842 11.7746 47.109 13.722 47.109 15.8294V35.6906C47.109 37.798 45.9842 39.7454 44.1583 40.7991L26.9507 50.7297C25.1248 51.7834 22.8752 51.7834 21.0493 50.7297L3.84159 40.7991C2.0157 39.7454 0.8909 37.798 0.8909 35.6906V15.8294C0.8909 13.722 2.0157 11.7746 3.84159 10.7209L21.0493 0.790295Z"/>
				</mask>
			</g>
		</svg>
	`),
} as const;

const avatarStackWithInnerBorderData = [
	{ key: 'person-one', name: 'Person one' },
	{
		key: 'evit-youtube',
		name: evilYouTubeLogo.name,
		appearance: 'hexagon',
		hasInnerBorder: true,
		src: evilYouTubeLogo.src,
	},
	{
		key: 'placeholder-agent',
		name: placeholderLogo.name,
		appearance: 'hexagon',
		hasInnerBorder: true,
		src: placeholderLogo.src,
	},
	{ key: 'person-three', name: 'Person three' },
	{ key: 'person-four', name: 'Person four' },
	{ key: 'person-five', name: 'Person five' },
	{ key: 'person-six', name: 'Person six' },
] satisfies Array<AvatarProps & { key: string; name: string }>;

const avatarStackWithoutInnerBorderData = [
	{ key: 'person-one', name: 'Person one' },
	{
		key: 'evit-youtube',
		name: evilYouTubeLogo.name,
		appearance: 'hexagon',
		hasInnerBorder: false,
		src: evilYouTubeLogo.src,
	},
	{
		key: 'placeholder-agent',
		name: placeholderLogo.name,
		appearance: 'hexagon',
		src: placeholderLogo.src,
	},
	{ key: 'person-three', name: 'Person three' },
	{ key: 'person-four', name: 'Person four' },
	{ key: 'person-five', name: 'Person five' },
	{ key: 'person-six', name: 'Person six' },
] satisfies Array<AvatarProps & { key: string; name: string }>;

const HexagonThirdPartyLogos = (): React.JSX.Element => (
	<Stack space="space.400">
		<Stack space="space.100">
			<Heading size="medium">Third-party logos in hexagon avatars</Heading>
			<Text as="p" color="color.text.subtle">
				Enable platform-dst-avatar-updated-geometry in the example toolbar to show the inner border
				that keeps light logo backgrounds distinct from the avatar edge.
			</Text>
		</Stack>

		<Stack space="space.200">
			<Heading as="h3" size="small">
				Geometry variants
			</Heading>
			<Inline space="space.500" shouldWrap>
				<Stack space="space.100">
					<Text weight="semibold">Legacy geometry</Text>
					<Avatar
						appearance="hexagon"
						hasInnerBorder
						name={placeholderLogo.name}
						size="xlarge"
						src={placeholderLogo.src}
					/>
				</Stack>
				<Stack space="space.100">
					<Text weight="semibold">Updated geometry</Text>
					<Avatar
						appearance="hexagon"
						hasInnerBorder
						name={placeholderLogo.name}
						size="xlarge"
						src={placeholderLogo.src}
						UNSAFE_isUpdatedGeometry
					/>
				</Stack>
			</Inline>
		</Stack>

		<Stack space="space.200">
			<Heading as="h3" size="small">
				Inner border variants
			</Heading>
			<Inline space="space.500" shouldWrap>
				<Stack space="space.100">
					<Text weight="semibold">Without inner border</Text>
					<Avatar
						appearance="hexagon"
						name={`${placeholderLogo.name} without inner border`}
						size="xlarge"
						src={placeholderLogo.src}
						UNSAFE_isUpdatedGeometry
					/>
				</Stack>
				<Stack space="space.100">
					<Text weight="semibold">With inner border</Text>
					<Avatar
						appearance="hexagon"
						hasInnerBorder
						name={`${placeholderLogo.name} with inner border`}
						size="xlarge"
						src={placeholderLogo.src}
						UNSAFE_isUpdatedGeometry
					/>
				</Stack>
			</Inline>
		</Stack>

		<Stack space="space.200">
			<Heading as="h3" size="small">
				Avatar stack
			</Heading>
			<Inline space="space.500" shouldWrap>
				<Stack space="space.100">
					<Text weight="semibold">Without inner border</Text>
					<AvatarGroup
						appearance="stack"
						data={avatarStackWithoutInnerBorderData}
						isTooltipDisabled
						label="Mixed human and agent avatar stack without inner border"
						size="large"
						UNSAFE_isUpdatedGeometry
					/>
				</Stack>
				<Stack space="space.100">
					<Text weight="semibold">With inner border</Text>
					<AvatarGroup
						appearance="stack"
						data={avatarStackWithInnerBorderData}
						isTooltipDisabled
						label="Mixed human and agent avatar stack with inner border"
						size="large"
						UNSAFE_isUpdatedGeometry
					/>
				</Stack>
			</Inline>
		</Stack>

		<Stack space="space.200">
			<Heading as="h3" size="small">
				Size variants
			</Heading>
			<Inline space="space.300" alignBlock="center" shouldWrap>
				<Stack space="space.100" alignInline="center">
					<Text>xxsmall</Text>
					<Avatar
						appearance="hexagon"
						hasInnerBorder
						name="Placeholder at xxsmall size"
						size="xxsmall"
						src={placeholderLogo.src}
						UNSAFE_isUpdatedGeometry
					/>
				</Stack>
				<Stack space="space.100" alignInline="center">
					<Text>small</Text>
					<Avatar
						appearance="hexagon"
						hasInnerBorder
						name="Placeholder at small size"
						size="small"
						src={placeholderLogo.src}
						UNSAFE_isUpdatedGeometry
					/>
				</Stack>
				<Stack space="space.100" alignInline="center">
					<Text>medium</Text>
					<Avatar
						appearance="hexagon"
						hasInnerBorder
						name="Placeholder at medium size"
						size="medium"
						src={placeholderLogo.src}
						UNSAFE_isUpdatedGeometry
					/>
				</Stack>
				<Stack space="space.100" alignInline="center">
					<Text>large</Text>
					<Avatar
						appearance="hexagon"
						hasInnerBorder
						name="Placeholder at large size"
						size="large"
						src={placeholderLogo.src}
						UNSAFE_isUpdatedGeometry
					/>
				</Stack>
				<Stack space="space.100" alignInline="center">
					<Text>xlarge</Text>
					<Avatar
						appearance="hexagon"
						hasInnerBorder
						name="Placeholder at xlarge size"
						size="xlarge"
						src={placeholderLogo.src}
						UNSAFE_isUpdatedGeometry
					/>
				</Stack>
				<Stack space="space.100" alignInline="center">
					<Text>xxlarge</Text>
					<Avatar
						appearance="hexagon"
						hasInnerBorder
						name="Placeholder at xxlarge size"
						size="xxlarge"
						src={placeholderLogo.src}
						UNSAFE_isUpdatedGeometry
					/>
				</Stack>
			</Inline>
		</Stack>
	</Stack>
);

export default HexagonThirdPartyLogos;

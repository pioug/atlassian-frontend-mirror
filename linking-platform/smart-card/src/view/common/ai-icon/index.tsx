import React from 'react';

import SVG from '@atlaskit/icon/svg';
import type { SVGProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { B200, B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

/**
 * The bulk of this file is originally from
 * https://bitbucket.org/atlassian/barrel/src/master/ui/platform/ui-kit/ai
 * with modifications
 */
const AiIcon = (props: SVGProps) => (
	<SVG {...props}>
		{/* defs section can be removed on platform.linking-platform.smart-card.hover-card-action-redesign cleanup */}
		{/* Safari has a nasty habit of occasionally not applying these gradients if they are defined after the path
        elements. So let's define them first. */}
		<defs>
			<linearGradient
				id="ai_icon_lg0"
				x1="21"
				y1="12"
				x2="17.5"
				y2="12"
				gradientUnits="userSpaceOnUse"
			>
				<stop
					offset="0.270833"
					stopColor={token('color.icon.accent.blue', B200)}
					color={token('color.icon.accent.blue', B200)}
				/>
				<stop
					offset="1"
					stopColor={token('color.text.accent.blue', B400)}
					color={token('color.text.accent.blue', B400)}
				/>
			</linearGradient>
			<linearGradient
				id="ai_icon_lg1"
				x1="12.5"
				y1="3"
				x2="12.5"
				y2="6.5"
				gradientUnits="userSpaceOnUse"
			>
				<stop
					offset="0.1875"
					stopColor={token('color.icon.accent.blue', B200)}
					color={token('color.icon.accent.blue', B200)}
				/>
				<stop
					offset="1"
					stopColor={token('color.text.accent.blue', B400)}
					color={token('color.text.accent.blue', B400)}
				/>
			</linearGradient>
			<linearGradient
				id="ai_icon_lg2"
				x1="6.82996"
				y1="12"
				x2="3.32996"
				y2="12"
				gradientUnits="userSpaceOnUse"
			>
				<stop
					stopColor={token('color.text.accent.blue', B400)}
					color={token('color.text.accent.blue', B400)}
				/>
				<stop
					offset="0.791667"
					stopColor={token('color.icon.accent.blue', B200)}
					color={token('color.icon.accent.blue', B200)}
				/>
			</linearGradient>
			<linearGradient
				id="ai_icon_lg3"
				x1="12.5"
				y1="17"
				x2="12.5"
				y2="21"
				gradientUnits="userSpaceOnUse"
			>
				<stop
					stopColor={token('color.text.accent.blue', B400)}
					color={token('color.text.accent.blue', B400)}
				/>
				<stop
					offset="0.802083"
					stopColor={token('color.icon.accent.blue', B200)}
					color={token('color.icon.accent.blue', B200)}
				/>
			</linearGradient>
		</defs>
		<g>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M17.17 12C17.17 11.4477 17.6177 11 18.17 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H18.17C17.6177 13 17.17 12.5523 17.17 12Z"
				fill={
					fg('platform.linking-platform.smart-card.hover-card-action-redesign')
						? token('color.icon', '#44546F')
						: 'url(#ai_icon_lg0)'
				}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12 3C12.5523 3 13 3.44772 13 4V5.83C13 6.38228 12.5523 6.83 12 6.83C11.4477 6.83 11 6.38228 11 5.83V4C11 3.44772 11.4477 3 12 3Z"
				fill={
					fg('platform.linking-platform.smart-card.hover-card-action-redesign')
						? token('color.icon', '#44546F')
						: 'url(#ai_icon_lg1)'
				}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3 12C3 11.4477 3.44772 11 4 11H5.83C6.38228 11 6.83 11.4477 6.83 12C6.83 12.5523 6.38228 13 5.83 13H4C3.44772 13 3 12.5523 3 12Z"
				fill={
					fg('platform.linking-platform.smart-card.hover-card-action-redesign')
						? token('color.icon', '#44546F')
						: 'url(#ai_icon_lg2)'
				}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12 17.17C12.5523 17.17 13 17.6177 13 18.17V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V18.17C11 17.6177 11.4477 17.17 12 17.17Z"
				fill={
					fg('platform.linking-platform.smart-card.hover-card-action-redesign')
						? token('color.icon', '#44546F')
						: 'url(#ai_icon_lg3)'
				}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M14.2929 14.2929C14.6835 13.9024 15.3166 13.9024 15.7071 14.2929L19.7071 18.2929C20.0977 18.6834 20.0977 19.3166 19.7071 19.7071C19.3166 20.0976 18.6835 20.0976 18.2929 19.7071L14.2929 15.7071C13.9024 15.3166 13.9024 14.6834 14.2929 14.2929Z"
				fill={
					fg('platform.linking-platform.smart-card.hover-card-action-redesign')
						? token('color.icon', '#44546F')
						: token('color.icon.accent.blue', B200)
				}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M19.7071 4.29289C20.0977 4.68342 20.0977 5.31658 19.7071 5.70711L15.7071 9.70711C15.3166 10.0976 14.6835 10.0976 14.2929 9.70711C13.9024 9.31658 13.9024 8.68342 14.2929 8.29289L18.2929 4.29289C18.6835 3.90237 19.3166 3.90237 19.7071 4.29289Z"
				fill={
					fg('platform.linking-platform.smart-card.hover-card-action-redesign')
						? token('color.icon', '#44546F')
						: token('color.icon.accent.blue', B200)
				}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L9.70711 8.29289C10.0976 8.68342 10.0976 9.31658 9.70711 9.70711C9.31658 10.0976 8.68342 10.0976 8.29289 9.70711L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289Z"
				fill={
					fg('platform.linking-platform.smart-card.hover-card-action-redesign')
						? token('color.icon', '#44546F')
						: token('color.icon.accent.blue', B200)
				}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.70711 14.2929C10.0976 14.6834 10.0976 15.3166 9.70711 15.7071L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071C3.90237 19.3166 3.90237 18.6834 4.29289 18.2929L8.29289 14.2929C8.68342 13.9024 9.31658 13.9024 9.70711 14.2929Z"
				fill={
					fg('platform.linking-platform.smart-card.hover-card-action-redesign')
						? token('color.icon', '#44546F')
						: token('color.icon.accent.blue', B200)
				}
			/>
		</g>
	</SVG>
);

export default AiIcon;

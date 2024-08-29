import React from 'react';

import { token } from '@atlaskit/tokens';

import { useIconThemed } from './use-icon-themed';

export default function ActionListIcon() {
	const { iconThemed } = useIconThemed();

	return (
		<svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect
				width="40"
				height="40"
				transform="translate(0 0.259766)"
				fill={iconThemed({ light: '#FFF', dark: '#161A1D' })}
			/>
			<rect
				x="0.5"
				y="0.759766"
				width="39"
				height="39"
				rx="2.5"
				stroke={token('color.border', '#091E42')}
				strokeOpacity="0.14"
			/>
			<rect
				x="6"
				y="6.25973"
				width="8"
				height="8"
				rx="2"
				fill={token('color.background.selected.bold', '#0052cc')}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.04781 12.1515C9.23925 12.3585 9.5745 12.3366 9.7422 12.1099L12.2311 8.74617C12.3921 8.52857 12.3594 8.21106 12.1582 8.03698C11.9569 7.8629 11.6633 7.89818 11.5023 8.11578L9.33981 11.0401L8.46333 10.0924C8.28109 9.8954 7.98561 9.8954 7.80337 10.0924C7.62113 10.2895 7.62113 10.609 7.80337 10.806L9.04781 12.1515Z"
				fill={token('color.icon.inverse', '#FFFFFF')}
			/>
			<path
				d="M17 10.2597C17 9.70744 17.4477 9.25973 18 9.25973H33C33.5523 9.25973 34 9.70744 34 10.2597C34 10.812 33.5523 11.2597 33 11.2597H18C17.4477 11.2597 17 10.812 17 10.2597Z"
				fill={token('color.background.accent.gray.subtler', '#DCDFE4')}
			/>
			<rect
				x="6"
				y="16.2597"
				width="8"
				height="8"
				rx="2"
				fill={token('color.background.selected.bold', '#0052cc')}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.04781 22.1515C9.23925 22.3585 9.5745 22.3366 9.7422 22.1099L12.2311 18.7462C12.3921 18.5286 12.3594 18.2111 12.1582 18.037C11.9569 17.8629 11.6633 17.8982 11.5023 18.1158L9.33981 21.0401L8.46333 20.0924C8.28109 19.8954 7.98561 19.8954 7.80337 20.0924C7.62113 20.2895 7.62113 20.609 7.80337 20.806L9.04781 22.1515Z"
				fill={token('color.icon.inverse', '#FFFFFF')}
			/>
			<path
				d="M17 20.2597C17 19.7074 17.4477 19.2597 18 19.2597H33C33.5523 19.2597 34 19.7074 34 20.2597C34 20.812 33.5523 21.2597 33 21.2597H18C17.4477 21.2597 17 20.812 17 20.2597Z"
				fill={token('color.background.accent.gray.subtler', '#DCDFE4')}
			/>
			<rect
				x="6"
				y="26.2597"
				width="8"
				height="8"
				rx="2"
				fill={iconThemed({ light: '#ECEDF0', dark: '#454F59' })}
			/>
			<path
				d="M17 30.2597C17 29.7074 17.4477 29.2597 18 29.2597H33C33.5523 29.2597 34 29.7074 34 30.2597C34 30.812 33.5523 31.2597 33 31.2597H18C17.4477 31.2597 17 30.812 17 30.2597Z"
				fill={token('color.background.accent.gray.subtler', '#DCDFE4')}
			/>
		</svg>
	);
}

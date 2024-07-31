import React from 'react';

import IconRecent from '@atlaskit/icon/core/migration/clock--recent';
import IconEmail from '@atlaskit/icon/core/migration/email';
import IconLocation from '@atlaskit/icon/core/migration/location';
import OfficeBuildingIcon from '@atlaskit/icon/core/migration/office-building';

import { DetailsLabel, DetailsLabelIcon, DetailsLabelText } from '../../styled/Card';

const icons = {
	location: IconLocation,
	time: IconRecent,
	email: IconEmail,
	companyName: OfficeBuildingIcon,
};

type Props = {
	icon: string;
	children?: React.ReactNode;
};

export default class IconLabel extends React.PureComponent<Props> {
	static defaultProps = {
		icon: '',
	};

	render() {
		if (!this.props.children) {
			return null;
		}

		// @ts-ignore
		const IconElement = this.props.icon && icons[this.props.icon];
		const displayIcon = IconElement ? (
			<IconElement label={`${this.props.icon}`} LEGACY_size="small" color="currentColor" />
		) : null;

		return (
			<DetailsLabel>
				<DetailsLabelIcon>{displayIcon}</DetailsLabelIcon>
				<DetailsLabelText>{this.props.children}</DetailsLabelText>
			</DetailsLabel>
		);
	}
}

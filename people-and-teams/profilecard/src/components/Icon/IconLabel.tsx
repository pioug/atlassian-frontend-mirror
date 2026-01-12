import React from 'react';

import IconRecent from '@atlaskit/icon/core/clock';
import IconEmail from '@atlaskit/icon/core/email';
import IconLocation from '@atlaskit/icon/core/location';
import OfficeBuildingIcon from '@atlaskit/icon/core/office-building';
import { token } from '@atlaskit/tokens';

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
	extraTopSpace?: boolean;
};

export default class IconLabel extends React.PureComponent<Props> {
	static defaultProps = {
		icon: '',
	};

	render(): React.JSX.Element | null {
		if (!this.props.children) {
			return null;
		}

		// @ts-ignore
		const IconElement = this.props.icon && icons[this.props.icon];
		const displayIcon = IconElement ? (
			<IconElement label={`${this.props.icon}`} color={token('color.text.subtlest')} />
		) : null;

		return (
			<DetailsLabel extraTopSpace={this.props.extraTopSpace}>
				<DetailsLabelIcon>{displayIcon}</DetailsLabelIcon>
				<DetailsLabelText>{this.props.children}</DetailsLabelText>
			</DetailsLabel>
		);
	}
}

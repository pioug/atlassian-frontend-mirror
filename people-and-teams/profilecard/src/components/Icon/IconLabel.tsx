import React from 'react';

import IconEmail from '@atlaskit/icon/glyph/email';
import IconLocation from '@atlaskit/icon/glyph/location';
import OfficeBuildingIcon from '@atlaskit/icon/glyph/office-building';
import IconRecent from '@atlaskit/icon/glyph/recent';

import {
  DetailsLabel,
  DetailsLabelIcon,
  DetailsLabelText,
} from '../../styled/Card';

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
      <IconElement label={`icon ${this.props.icon}`} size="small" />
    ) : null;

    return (
      <DetailsLabel>
        <DetailsLabelIcon>{displayIcon}</DetailsLabelIcon>
        <DetailsLabelText>{this.props.children}</DetailsLabelText>
      </DetailsLabel>
    );
  }
}

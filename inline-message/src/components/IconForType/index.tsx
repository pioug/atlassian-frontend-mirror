import React from 'react';
import { IconType } from '../../types';
import IconWrapper from './styledIconForType';
import { typesMapping } from '../../constants';

interface Props {
  isHovered: boolean;
  isOpen: boolean;
  type: IconType;
}

export default class SelectedIconForType extends React.Component<Props, {}> {
  render() {
    const { type, isHovered, isOpen } = this.props;
    const {
      [type]: { icon: SelectedIcon, iconSize },
    } = typesMapping;

    return (
      <IconWrapper appearance={type} isHovered={isHovered} isOpen={isOpen}>
        <SelectedIcon label="Inline message icon" size={iconSize} />
      </IconWrapper>
    );
  }
}

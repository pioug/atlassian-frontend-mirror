import React from 'react';
import { Component } from 'react';
import FieldRange from '@atlaskit/range';
import ScaleLargeIcon from '@atlaskit/icon/glyph/media-services/scale-large';
import ScaleSmallIcon from '@atlaskit/icon/glyph/media-services/scale-small';
import Button from '@atlaskit/button/custom-theme-button';
import { SliderWrapper } from './styled';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const defaultProps = {
  value: 0,
};

export class Slider extends Component<SliderProps, {}> {
  static defaultProps = defaultProps;

  render() {
    const { value, onChange } = this.props;
    return (
      <SliderWrapper>
        <Button
          className="zoom_button zoom_button_small"
          iconAfter={<ScaleSmallIcon label="scale-small-icon" />}
          onClick={() => onChange(0)}
        />
        <FieldRange value={value} onChange={onChange} />
        <Button
          className="zoom_button zoom_button_large"
          iconAfter={<ScaleLargeIcon label="scale-large-icon" />}
          onClick={() => onChange(100)}
        />
      </SliderWrapper>
    );
  }
}

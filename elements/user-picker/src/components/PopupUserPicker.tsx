import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { PopupSelect } from '@atlaskit/select';
import React from 'react';
import { PopupUserPickerProps } from '../types';
import { getPopupComponents } from './components';
import { getPopupStyles } from './styles';
import { getPopupProps } from './popup';
import { BaseUserPickerWithoutAnalytics } from './BaseUserPicker';

interface State {
  flipped: boolean;
}

export class PopupUserPickerWithoutAnalytics extends React.Component<
  PopupUserPickerProps,
  State
> {
  static defaultProps = {
    boundariesElement: 'viewport',
    width: 300,
    isMulti: false,
    offset: [0, 0],
    placement: 'auto',
    rootBoundary: 'viewport',
    shouldFlip: true,
  };
  state = {
    flipped: false,
  };

  handleFlipStyle = (data: { flipped: boolean; styles: any; popper: any }) => {
    const {
      flipped,
      styles: { transform },
      popper: { height },
    } = data;
    this.setState({ flipped });
    if (!flipped) {
      return data;
    }

    data.styles.transform =
      transform + `translate(0, ${height}px) translate(0, -100%)`;
    return data;
  };

  render() {
    const {
      target,
      popupTitle,
      boundariesElement,
      isMulti,
      offset,
      placement,
      rootBoundary,
      shouldFlip,
    } = this.props;
    const { flipped } = this.state;
    const width = this.props.width as string | number;
    const styles = getPopupStyles(width, flipped, isMulti);

    return (
      <BaseUserPickerWithoutAnalytics
        {...this.props}
        SelectComponent={PopupSelect}
        width={width}
        styles={styles}
        components={getPopupComponents(!!popupTitle)}
        pickerProps={getPopupProps(
          width,
          target,
          this.handleFlipStyle,
          boundariesElement,
          offset,
          placement,
          rootBoundary,
          shouldFlip,
          popupTitle,
        )}
      />
    );
  }
}

export const PopupUserPicker = withAnalyticsEvents()(
  PopupUserPickerWithoutAnalytics,
);

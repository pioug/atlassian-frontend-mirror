/** @jsx jsx */
import { jsx } from '@emotion/core';

import React from 'react';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import { AppearanceType, KeyboardOrMouseEvent } from '../types';
import {
  Header,
  Title,
  TitleText,
  titleIconWrapperStyles,
} from '../styled/Content';

const TitleIcon = ({ appearance }: { appearance?: 'danger' | 'warning' }) => {
  if (!appearance) return null;

  const Icon = appearance === 'danger' ? ErrorIcon : WarningIcon;

  return (
    <span css={titleIconWrapperStyles(appearance)}>
      <Icon label={`${appearance} icon`} />
    </span>
  );
};

export interface HeaderProps extends HeaderComponentProps {
  /**
    Boolean OR Function indicating which element to focus when the component mounts
    TRUE will automatically find the first "tabbable" element within the modal
    Providing a function should return the element you want to focus
  */
  /** Component to render the header of the modal. */
  component?: React.ElementType<HeaderComponentProps>;
}

export interface HeaderComponentProps {
  /** Appearance of the primary button. Also adds an icon to the heading, if provided. */
  appearance?: AppearanceType;

  /** The modal heading */
  heading?: React.ReactNode;
  /** Function to close the dialog */
  onClose: (e: KeyboardOrMouseEvent) => void;
  /** Whether or not to display a line under the header */
  showKeyline?: boolean;
  /**
   * Makes heading multiline.
   * If false and heading is longer than one line overflow will be not displayed.
   */
  isHeadingMultiline?: boolean;
}

export default class ModalHeader extends React.Component<HeaderProps, {}> {
  static defaultProps = {
    isHeadingMultiline: true,
  };

  render() {
    const {
      appearance,
      component,
      heading,
      onClose,
      showKeyline,
      isHeadingMultiline,
    } = this.props;
    const warning = 'You can provide `component` OR `heading`, not both.';

    if (!component && !heading) return null;
    if (component && heading) {
      console.warn(warning); // eslint-disable-line no-console
      return null;
    }
    if (component) {
      return React.createElement(component, {
        appearance,
        onClose,
        showKeyline,
        isHeadingMultiline,
      });
    }

    return (
      <Header showKeyline={showKeyline}>
        <Title>
          <TitleIcon appearance={appearance} />
          <TitleText isHeadingMultiline={isHeadingMultiline}>
            {heading}
          </TitleText>
        </Title>
      </Header>
    );
  }
}

/** @jsx jsx */
import React, { useMemo } from 'react';

import { jsx } from '@emotion/core';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import {
  getTitleIconStyles,
  getTitleTextStyles,
  headerStyles,
  titleStyles,
} from '../styles/content';
import { AppearanceType, KeyboardOrMouseEvent } from '../types';

const TitleIcon = ({
  appearance,
  isHeadingMultiline,
}: Required<Pick<HeaderProps, 'appearance' | 'isHeadingMultiline'>>) => {
  const titleIconStyles = useMemo(() => {
    return getTitleIconStyles({ appearance, isHeadingMultiline });
  }, [appearance, isHeadingMultiline]);

  const Icon = appearance === 'danger' ? ErrorIcon : WarningIcon;

  return (
    <span css={titleIconStyles}>
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
  /**
   * Unique identifier for the heading.
   */
  id?: string;

  /**
   * Appearance of the modal that changes the color of the primary action and adds an icon to the heading.
   */
  appearance?: AppearanceType;

  /**
   * Callback function called when the modal dialog is requesting to be closed.
   */
  onClose: (e: KeyboardOrMouseEvent) => void;

  /**
   * Heading for the modal dialog.
   */
  heading?: React.ReactNode;

  /**
   * When set to `true` should be used to draw a line underneath the header signifying that there is overflowed content inside the modal dialog.
   */
  showKeyline?: boolean;

  /**
   * When `true` will allow the heading to span multiple lines.
   * Defaults to `false`.
   */
  isHeadingMultiline?: boolean;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

export default function ModalHeader(props: HeaderProps) {
  const {
    id,
    appearance,
    component,
    heading,
    onClose,
    testId,
    isHeadingMultiline = true,
  } = props;
  const warning = 'You can provide `component` OR `heading`, not both.';
  const titleTextStyles = useMemo(() => {
    return getTitleTextStyles(isHeadingMultiline);
  }, [isHeadingMultiline]);

  if (!component && !heading) {
    return null;
  }
  if (component && heading) {
    console.warn(warning); // eslint-disable-line no-console
    return null;
  }
  if (component) {
    return React.createElement(component, {
      id,
      testId,
      appearance,
      onClose,
      isHeadingMultiline,
    });
  }

  return (
    <header css={headerStyles} data-testid={testId && `${testId}--header`}>
      <h1 css={titleStyles}>
        {appearance && (
          <TitleIcon
            appearance={appearance}
            isHeadingMultiline={isHeadingMultiline}
          />
        )}
        <span
          id={id}
          css={titleTextStyles}
          data-testid={testId && `${testId}-heading`}
        >
          {heading}
        </span>
      </h1>
    </header>
  );
}

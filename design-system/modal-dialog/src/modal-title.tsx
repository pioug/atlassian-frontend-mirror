/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import { useModal } from './hooks';
import { iconColor, titleIconMargin } from './internal/constants';
import { Appearance } from './types';

const fontSize = 20;
const lineHeight = 1;
const adjustedLineHeight = 1.2;

const titleStyles = css({
  display: 'flex',
  minWidth: 0,

  margin: 0,
  alignItems: 'center',

  fontSize: `${fontSize}px`,
  fontStyle: 'inherit',
  fontWeight: 500,
  letterSpacing: `-0.008em`,
  lineHeight: lineHeight,
});

const textStyles = css({
  minWidth: 0,

  /**
   * This ensures that the element fills the whole header space
   * and its content does not overflow (since flex items don't
   * shrink past its content size by default). */
  flex: '1 1 auto',
  wordWrap: 'break-word',
});

const iconStyles = css({
  marginRight: `${titleIconMargin}px`,

  /* Keeps the size of the icon the same, in case the text element grows in width. */
  flex: '0 0 auto',
});

/**
 * When the title is truncated (not multi-line), we adjust the
 * line height to avoid cropping the descenders. This removes
 * the extra spacing that we get from that adjustment. */
const lineHeightOffset = fontSize - fontSize * adjustedLineHeight;

const truncatedTextStyles = css({
  marginTop: `${lineHeightOffset / 2}px`,
  marginBottom: `${lineHeightOffset / 2}px`,

  lineHeight: adjustedLineHeight,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const truncatedTextIconStyles = css({
  marginBottom: `${lineHeightOffset / 2}px`,
  lineHeight: 1.2,
});

const TitleIcon = ({
  appearance,
  isMultiline,
}: Required<Pick<ModalTitleProps, 'appearance' | 'isMultiline'>>) => {
  const Icon = appearance === 'danger' ? ErrorIcon : WarningIcon;

  return (
    <span css={[iconStyles, !isMultiline && truncatedTextIconStyles]}>
      <Icon label={`${appearance} icon`} primaryColor={iconColor[appearance]} />
    </span>
  );
};

export interface ModalTitleProps {
  /**
   * Appearance of the modal that changes the color of the primary action and adds an icon to the title.
   */
  appearance?: Appearance;

  /**
   * Children of modal dialog header.
   */
  children?: ReactNode;

  /**
   * When `true` will allow the title to span multiple lines.
   * Defaults to `true`.
   */
  isMultiline?: boolean;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

const ModalTitle = (props: ModalTitleProps) => {
  const {
    appearance,
    children,
    isMultiline = true,
    testId: userDefinedTestId,
  } = props;
  const { titleId, testId: modalTestId } = useModal();

  const testId = userDefinedTestId || (modalTestId && `${modalTestId}--title`);

  return (
    <h1 css={titleStyles} data-testid={testId}>
      {appearance && (
        <TitleIcon appearance={appearance} isMultiline={isMultiline} />
      )}
      <span
        id={titleId}
        css={[textStyles, !isMultiline && truncatedTextStyles]}
        data-testid={testId && `${testId}-text`}
      >
        {children}
      </span>
    </h1>
  );
};

export default ModalTitle;

/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { token } from '@atlaskit/tokens';

import { useModal } from './hooks';
import { iconColor } from './internal/constants';
import { Appearance } from './types';

const titleStyles = css({
  display: 'flex',
  minWidth: 0,

  margin: token('space.0', '0px'),
  gap: token('space.100'),

  font: token('font.heading.medium'),
});

const textStyles = css({
  minWidth: 0,

  /**
   * This ensures that the element fills the whole header space
   * and its content does not overflow (since flex items don't
   * shrink past its content size by default).
   */
  flex: '1 1 auto',
  wordWrap: 'break-word',
});

const iconStyles = css({
  flex: '0 0 auto',
});

const truncatedTextStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const TitleIcon = ({
  appearance,
}: Required<Pick<ModalTitleProps, 'appearance'>>) => {
  const Icon = appearance === 'danger' ? ErrorIcon : WarningIcon;

  return (
    <span css={iconStyles}>
      <Icon label={appearance} primaryColor={iconColor[appearance]} />
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

/**
 * __Modal title__
 *
 * A modal title is used to display a title within a modal.
 *
 * - [Examples](https://atlassian.design/components/modal-dialog/examples)
 * - [Code](https://atlassian.design/components/modal-dialog/code)
 * - [Usage](https://atlassian.design/components/modal-dialog/usage)
 */
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
      {appearance && <TitleIcon appearance={appearance} />}
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

/** @jsx jsx */
import React, { useCallback, useState } from 'react';
import { css, jsx } from '@emotion/react';
import AtlaskitLozenge from '@atlaskit/lozenge';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { LozengeProps } from './types';

const styles = css`
  display: inline-flex;
  line-height: inherit;
`;

const actionStyles = css`
  > span > span {
    display: inline-flex;
    align-items: center;
    margin-right: -2px;
  }

  svg {
    width: unset;
    height: unset;
    margin: -4px 0;
  }

  :hover {
    cursor: pointer;
  }
`;

/**
 * A base element that displays a Lozenge.
 * @internal
 * @param {LozengeProps} LozengeProps - The props necessary for the Lozenge element.
 * @see State
 */
const Lozenge: React.FC<LozengeProps> = ({
  appearance = 'default',
  name,
  onClick,
  overrideCss,
  text,
  testId = 'smart-element-lozenge',
}) => {
  const [isBold, setIsBold] = useState(false);
  const onHover = useCallback(
    (isHover: boolean) => {
      if (onClick) {
        setIsBold(isHover);
      }
    },
    [onClick],
  );
  const onMouseEnter = useCallback(() => onHover(true), [onHover]);
  const onMouseLeave = useCallback(() => onHover(false), [onHover]);

  if (!text) {
    return null;
  }

  return (
    <span
      css={[styles, onClick ? actionStyles : undefined, overrideCss]}
      data-fit-to-content
      data-smart-element={name}
      data-smart-element-lozenge
      data-testid={testId}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={onClick ? 0 : -1}
    >
      <AtlaskitLozenge
        appearance={appearance}
        isBold={isBold}
        testId={`${testId}-lozenge`}
      >
        {text}
        {onClick && (
          <ChevronDownIcon label="action" testId={`${testId}-action`} />
        )}
      </AtlaskitLozenge>
    </span>
  );
};

export default Lozenge;

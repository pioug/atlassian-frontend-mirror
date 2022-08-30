/** @jsx jsx */

import { forwardRef, MouseEventHandler, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import FocusRing from '@atlaskit/focus-ring';
import { token } from '@atlaskit/tokens';

export type TreeItemLeafProps = {
  ariaExpanded?: boolean;
  ariaControls?: string;
  className?: string;
  draggableState?: 'idle' | 'dragging' | 'preview';
  elementAfter?: ReactNode;
  elementBefore?: ReactNode;
  id: string;
  inset: number;
  label?: string;
  onClick?: MouseEventHandler;
};

const itemStyles = css({
  display: 'grid',
  width: '100%',
  padding: 8,
  alignItems: 'center',
  gap: 4,
  gridTemplateColumns: 'auto 1fr auto',
  background: token('color.background.neutral.subtle', 'transparent'),
  border: 0,
  borderRadius: 3,
  /**
   * Without this Safari renders white text on drag.
   */
  color: token('color.text', 'currentColor'),
  ':hover': {
    background: token(
      'color.background.neutral.subtle.hovered',
      'rgba(9, 30, 66, 0.06)',
    ),
    cursor: 'pointer',
  },
});

const stateStyles = {
  idle: css({}),
  dragging: css({
    opacity: 0.5,
  }),
  preview: css({}),
};

const labelStyles = css({
  overflow: 'hidden',
  textAlign: 'left',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const idStyles = css({
  margin: 0,
  color: token('color.text.disabled', '#8993A5'),
});

const iconColor = token('color.icon', '#44546F');

const ItemIcon = () => (
  <svg aria-hidden={true} width={24} height={24} viewBox="0 0 24 24">
    <circle cx={12} cy={12} r={2} fill={iconColor} />
  </svg>
);

const TreeItem = forwardRef<HTMLButtonElement, TreeItemLeafProps>(
  (
    {
      ariaExpanded,
      ariaControls,
      className,
      draggableState = 'idle',
      elementAfter,
      elementBefore: elementBeforeProp,
      id: idProp,
      inset,
      label = 'Tree item',
      onClick,
    },
    ref,
  ) => {
    const elementBefore = elementBeforeProp ?? <ItemIcon />;
    const id = `tree-item-${idProp}`;

    return (
      <FocusRing isInset>
        <button
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
          className={className}
          css={[itemStyles, stateStyles[draggableState]]}
          id={id}
          style={{ paddingLeft: 8 + inset }}
          onClick={onClick}
          ref={ref}
          type="button"
        >
          {elementBefore}
          <span css={labelStyles}>{label}</span>
          <small css={idStyles}>
            <code>ID:'{idProp}'</code>
          </small>
          {elementAfter}
        </button>
      </FocusRing>
    );
  },
);

export default TreeItem;

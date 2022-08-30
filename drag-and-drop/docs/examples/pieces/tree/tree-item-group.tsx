/** @jsx jsx */

import { Children, forwardRef, MouseEventHandler, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import Badge from '@atlaskit/badge';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { token } from '@atlaskit/tokens';

import TreeItemLeaf, { TreeItemLeafProps } from './tree-item-leaf';

export type TreeItemGroupProps = TreeItemLeafProps & {
  children?: ReactNode;
  isOpen?: boolean;
  onClick: MouseEventHandler;
};

const badgeStyles = css({
  position: 'absolute',
  top: -8,
  right: -10,
  /**
   * Using a transform gets clipped on Safari.
   */
  // top: 0,
  // right: 0,
  // transform: 'translate(50%, -50%)',
});

const iconColor = token('color.icon', '#44546F');

const GroupIcon = ({ isOpen }: { isOpen: boolean }) => {
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;
  return <Icon label="" primaryColor={iconColor} />;
};

const collapsedStyles = css({
  display: 'none',
});

const TreeItemGroup = forwardRef<HTMLButtonElement, TreeItemGroupProps>(
  (
    {
      children,
      className,
      id,
      inset,
      isOpen = false,
      label = 'Tree group',
      onClick,
      draggableState,
    },
    ref,
  ) => {
    const childCount = Children.count(children);
    const isPreview = draggableState === 'preview';
    const subtreeId = `tree-item-${id}--subtree`;

    return (
      <div>
        <TreeItemLeaf
          ariaControls={subtreeId}
          ariaExpanded={isOpen}
          className={className}
          draggableState={draggableState}
          elementAfter={
            <div css={badgeStyles} style={{ opacity: isPreview ? 1 : 0 }}>
              <Badge appearance="primary">{childCount}</Badge>
            </div>
          }
          elementBefore={<GroupIcon isOpen={isOpen} />}
          id={id}
          inset={inset}
          label={label}
          onClick={onClick}
          ref={ref}
        />
        {draggableState === 'idle' && (
          <div id={subtreeId} css={isOpen || collapsedStyles}>
            {children}
          </div>
        )}
      </div>
    );
  },
);

export default TreeItemGroup;

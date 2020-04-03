/** @jsx jsx */

import { jsx } from '@emotion/core';
import { Skeleton as SkeletonAvatar } from '@atlaskit/avatar';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

interface WrapperProps {
  isAvatarHidden?: boolean;
  isHeader?: boolean;
}
interface DrawerSkeletonItemProps {
  isCollapsed?: boolean;
  itemTextWidth?: string;
  isAvatarHidden?: boolean;
}
interface DrawerSkeletonHeaderProps {
  isCollapsed?: boolean;
  isAvatarHidden?: boolean;
}
interface SkeletonTextProps {
  isHeader?: boolean;
  itemTextWidth?: string;
  isAvatarHidden?: boolean;
}

const gridSize = gridSizeFn();

/* Primitives */
const Wrapper: React.ComponentType<WrapperProps> = ({
  isAvatarHidden,
  isHeader,
  ...props
}) => (
  <div
    css={{
      display: 'flex',
      alignItems: 'center',
      margin: isAvatarHidden
        ? `${gridSize * 2}px`
        : `${gridSize / 2}px ${gridSize}px ${gridSize}px ${gridSize * 2}px`,
      ...(isHeader && !isAvatarHidden ? { marginLeft: `${gridSize}px` } : {}),
    }}
    {...props}
  />
);

const headerStylesOverride = (isAvatarHidden?: boolean) => ({
  ...(!isAvatarHidden ? { marginLeft: `${gridSize * 2}px` } : null),
  width: `${gridSize * 18}px`,
  opacity: 0.3,
});

const SkeletonText = ({
  isAvatarHidden,
  isHeader,
  itemTextWidth,
}: SkeletonTextProps) => (
  <div
    css={{
      height: `${gridSize * 2.5}px`,
      backgroundColor: 'currentColor',
      borderRadius: gridSize / 2,
      opacity: 0.15,
      width: itemTextWidth || `${gridSize * 17}px`,
      ...(!isAvatarHidden ? { marginLeft: `${gridSize * 3}px` } : null),
      ...(isHeader ? headerStylesOverride(isAvatarHidden) : null),
    }}
  />
);

/* Exported Components */
export const DrawerSkeletonHeader = (props: DrawerSkeletonHeaderProps) => {
  const { isAvatarHidden, isCollapsed } = props;
  return (
    <Wrapper isAvatarHidden={isAvatarHidden} isHeader>
      {!isAvatarHidden && (
        <SkeletonAvatar appearance="square" size="large" weight="strong" />
      )}
      {!isCollapsed && (
        <SkeletonText isHeader isAvatarHidden={isAvatarHidden} />
      )}
    </Wrapper>
  );
};

export const DrawerSkeletonItem = (props: DrawerSkeletonItemProps) => {
  const { isAvatarHidden, isCollapsed, itemTextWidth } = props;

  return (
    <Wrapper isAvatarHidden={isAvatarHidden}>
      {!isAvatarHidden && <SkeletonAvatar size="small" weight="normal" />}
      {!isCollapsed && (
        <SkeletonText
          itemTextWidth={itemTextWidth}
          isAvatarHidden={isAvatarHidden}
        />
      )}
    </Wrapper>
  );
};

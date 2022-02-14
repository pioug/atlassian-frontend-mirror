import React from 'react';

export const handleClickCommon = (
  event: React.MouseEvent,
  onClick?: React.MouseEventHandler,
) => {
  if (onClick) {
    event.preventDefault();
    event.stopPropagation();
    onClick(event);
  }
};

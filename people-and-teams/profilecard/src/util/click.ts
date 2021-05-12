import React from 'react';

type Event = React.MouseEvent | React.KeyboardEvent;

export const isBasicClick = (event: Event) => {
  return !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

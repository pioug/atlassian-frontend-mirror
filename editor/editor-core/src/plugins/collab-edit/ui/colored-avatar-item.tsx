import React from 'react';
import { getAvatarColor } from '../utils';
import { Badge } from './styles';

export interface ColoredAvatarItemProps {
  sessionId: string;
  name: string;
}

export const ColoredAvatarItem: React.StatelessComponent<ColoredAvatarItemProps> = (
  props,
) => {
  const color = getAvatarColor(props.sessionId).color.solid;
  const avatar = props.name.substr(0, 1).toUpperCase();
  return (
    <Badge color={color} data-testid="editor-collab-badge">
      {avatar}
    </Badge>
  );
};

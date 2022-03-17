/** @jsx jsx */
import { jsx } from '@emotion/react';
import { getAvatarColor } from '../utils';
import { badge } from './styles';

export interface ColoredAvatarItemProps {
  sessionId: string;
  name: string;
}

export const ColoredAvatarItem = (props: ColoredAvatarItemProps) => {
  const color = getAvatarColor(props.sessionId).color.solid;
  const avatar = props.name.substr(0, 1).toUpperCase();
  return (
    <div css={badge(color)} data-testid="editor-collab-badge">
      {avatar}
    </div>
  );
};

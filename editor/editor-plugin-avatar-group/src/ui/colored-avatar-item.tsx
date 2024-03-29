/** @jsx jsx */
import { jsx } from '@emotion/react';

import type {
  OptionalPlugin,
  PublicPluginAPI,
} from '@atlaskit/editor-common/types';
import type { CollabEditPlugin } from '@atlaskit/editor-plugin-collab-edit';
import { R100 } from '@atlaskit/theme/colors';

import { badge } from './styles';

export interface ColoredAvatarItemProps {
  sessionId: string;
  name: string;
  api: PublicPluginAPI<[OptionalPlugin<CollabEditPlugin>]> | undefined;
}

export const ColoredAvatarItem = (props: ColoredAvatarItemProps) => {
  const color = props.api?.collabEdit?.actions?.getAvatarColor(props.sessionId)
    .color.solid;
  const avatar = props.name.substr(0, 1).toUpperCase();
  return (
    // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
    <div css={badge(color || R100)} data-testid="editor-collab-badge">
      {avatar}
    </div>
  );
};

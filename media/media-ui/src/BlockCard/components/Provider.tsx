/** @jsx jsx */
import { jsx } from '@emotion/core';
import { N300 } from '@atlaskit/theme/colors';
import { gs } from '../utils';

export interface ProviderProps {
  name: string;
  iconUrl?: string;
  icon?: React.ReactNode;
}

export const Provider = ({ name, iconUrl, icon }: ProviderProps) => {
  let iconToRender = icon || null;

  if (!iconToRender && iconUrl) {
    iconToRender = (
      <img css={{ height: gs(1.5), width: gs(1.5) }} src={iconUrl} />
    );
  }

  return (
    <div css={{ display: 'flex', alignItems: 'center' }}>
      {iconToRender}
      <span
        css={{
          fontSize: gs(1.5),
          color: N300,
          margin: 0,
          marginLeft: gs(0.5),
        }}
      >
        {name}
      </span>
    </div>
  );
};

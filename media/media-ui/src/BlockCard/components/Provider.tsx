/** @jsx jsx */
import { jsx } from '@emotion/core';
import { N300 } from '@atlaskit/theme/colors';
import { gs } from '../utils';

export interface ProviderProps {
  name: string;
  icon?: React.ReactNode;
}

export const Provider = ({ name, icon }: ProviderProps) => {
  let iconToRender = icon || null;

  if (typeof icon === 'string') {
    iconToRender = (
      <img
        className="smart-link-icon"
        css={{ height: gs(1.5), width: gs(1.5) }}
        src={icon}
      />
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
          // EDM-713: fixes copy-paste from renderer to editor for Firefox
          // due to HTML its unwrapping behaviour on paste.
          MozUserSelect: 'none',
        }}
      >
        {name}
      </span>
    </div>
  );
};

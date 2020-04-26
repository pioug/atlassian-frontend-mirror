/** @jsx jsx */
import { jsx } from '@emotion/core';
import Tooltip from '@atlaskit/tooltip';

import { gs } from '../utils';
import { N300 } from '@atlaskit/theme/colors';

export interface MetadataProps {
  /* Text to be displayed at the bottom of a card - most often the provider name. */
  text: string;
  /* Icon to be displayed at the bottom of a card - most often the provider's logo. */
  icon?: React.ReactNode;
  iconUrl?: string;
  tooltip?: string;
}

export const Metadata = ({ text, icon, iconUrl, tooltip }: MetadataProps) => {
  let metadataIcon = icon || null;

  if (!metadataIcon && iconUrl) {
    metadataIcon = <img src={iconUrl} css={{ width: gs(1), height: gs(1) }} />;
  }

  const metadata = (
    <div css={{ display: 'flex', alignItems: 'center', marginRight: gs(0.5) }}>
      {metadataIcon}
      <span
        css={{
          fontSize: gs(1.5),
          color: `${N300}`,
          marginRight: gs(0.5),
          marginLeft: '2px',
        }}
      >
        {text}
      </span>
    </div>
  );
  if (tooltip) {
    return <Tooltip content={tooltip}>{metadata}</Tooltip>;
  }

  return metadata;
};

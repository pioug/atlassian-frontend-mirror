/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import Avatar from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';

import { FormatOptionLabelMeta } from '@atlaskit/select';
import { Option } from '@atlaskit/editor-common/extensions';

const itemWrapper = css`
  display: flex;
  align-items: center;

  small {
    margin: 0;
    display: block;
    color: currentColor;
  }
`;

const iconWrapper = css`
  line-height: 1;
`;

const iconWrapperMenu = css`
  align-self: flex-start;
  margin-top: 3px;
`;

const getIconSize = (context: 'menu' | 'value', description?: string) => {
  if (context === 'value' || !description) {
    return 'xsmall';
  }

  return 'small';
};

export const formatOptionLabel = (
  { label, icon, description }: Option,
  { context }: FormatOptionLabelMeta<Option>,
) => {
  return (
    <div css={itemWrapper}>
      <span css={[iconWrapper, context === 'menu' && iconWrapperMenu]}>
        {typeof icon === 'string' ? (
          <Avatar
            src={icon}
            size={getIconSize(context, description)}
            appearance="square"
          />
        ) : (
          icon
        )}
      </span>
      <div style={{ paddingLeft: icon ? token('space.100', '8px') : 0 }}>
        <p>
          {label}
          {description && context !== 'value' && <small>{description}</small>}
        </p>
      </div>
    </div>
  );
};

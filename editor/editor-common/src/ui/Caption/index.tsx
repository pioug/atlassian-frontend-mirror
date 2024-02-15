/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import { N200, N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from './messages';

const captionWrapperStyle = css`
  margin-top: ${token('space.100', '8px')};
  text-align: center;
  position: relative;
  color: ${token('color.text.subtle', N400)};
`;

const placeholderStyle = css`
  color: ${token('color.text.subtlest', N200)};
  position: absolute;
  top: 0;
  width: 100%;
`;

type Props = {
  selected?: boolean;
  hasContent?: boolean;
  children?: React.ReactNode;
  dataAttributes?: {
    'data-renderer-start-pos': number;
  };
};

export class CaptionComponent extends React.Component<
  Props & WrappedComponentProps
> {
  render() {
    const {
      selected,
      hasContent,
      children,
      dataAttributes,
      intl: { formatMessage },
    } = this.props;

    const showPlaceholder = !selected && !hasContent;

    return (
      <div
        data-media-caption
        data-testid="media-caption"
        {...dataAttributes}
        css={captionWrapperStyle}
      >
        {showPlaceholder ? (
          <p css={placeholderStyle}>{formatMessage(messages.placeholder)}</p>
        ) : null}
        {children}
      </div>
    );
  }
}

export default injectIntl(CaptionComponent);

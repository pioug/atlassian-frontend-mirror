import React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';

import { N200, N400 } from '@atlaskit/theme/colors';

import { messages } from './messages';

const CaptionWrapper = styled.div`
  margin-top: 8px;
  text-align: center;
  position: relative;
  color: ${N400};
`;

const Placeholder = styled.p`
  color: ${N200};
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
  Props & InjectedIntlProps
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
      <CaptionWrapper
        data-media-caption
        data-testid="media-caption"
        {...dataAttributes}
      >
        {showPlaceholder ? (
          <Placeholder>{formatMessage(messages.placeholder)}</Placeholder>
        ) : null}
        {children}
      </CaptionWrapper>
    );
  }
}

export default injectIntl(CaptionComponent);

import React, { PureComponent } from 'react';

import Avatar from '@atlaskit/avatar';
import { components } from '@atlaskit/select';
import { N200 } from '@atlaskit/theme/colors';
import { fontSize, gridSize as gridSizeFn } from '@atlaskit/theme/constants';

const gridSize = gridSizeFn();

const ContentWrapper = (props) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflowX: 'hidden',
    }}
    {...props}
  />
);
const TextWrapper = (props) => (
  <div
    css={{
      flex: '1 1 auto',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      lineHeight: 16 / fontSize(),
    }}
    {...props}
  />
);
const SubTextWrapper = (props) => (
  <div
    css={{
      color: N200,
      flex: '1 1 auto',
      fontSize: 12,
      lineHeight: 14 / 12,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    {...props}
  />
);
const ElementWrapper = ({ is, ...props }) => {
  const direction = { before: 'marginRight', after: 'marginLeft' };
  const margin = direction[is];

  return (
    <div
      css={{
        alignItems: 'center',
        display: 'flex',
        flexShrink: 0,
        [margin]: gridSize,
      }}
      {...props}
    />
  );
};

export default class Option extends PureComponent {
  render() {
    const {
      innerProps,
      innerRef,
      data: { avatar, subText, text },
    } = this.props;
    return (
      <div ref={innerRef} {...innerProps}>
        <components.Option {...this.props}>
          {!!avatar && (
            <ElementWrapper is="before">
              <Avatar
                borderColor="transparent"
                src={avatar}
                appearance="square"
              />
            </ElementWrapper>
          )}
          <ContentWrapper>
            <TextWrapper>{text}</TextWrapper>
            {!!subText && <SubTextWrapper>{subText}</SubTextWrapper>}
          </ContentWrapper>
        </components.Option>
      </div>
    );
  }
}

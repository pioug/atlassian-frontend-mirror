import React from 'react';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';
import { gridSize } from '@atlaskit/theme/constants';
import { components, ControlProps } from '@atlaskit/select';
import styled, { css } from 'styled-components';
import { N200, DN90 } from '@atlaskit/theme/colors';

const spacing = gridSize();
const fontSize = 12;
const innerHeight = spacing * 2; // 16px
const lineHeight = innerHeight / fontSize;

const ControlWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px ${spacing}px ${spacing}px;
`;

const getColor = themed({
  light: token('color.text.subtlest', N200),
  dark: token('color.text.subtlest', DN90),
});

const getPadding = () => {
  const right = 0;
  const bottom = spacing / 2;
  const left = 0;
  const top = spacing * 2.5;

  return css`
    padding: ${top}px ${right}px ${bottom}px ${left}px;
  `;
};

const Label = styled.div`
  color: ${(props) => getColor(props)};
  font-size: ${fontSize}px;
  font-weight: 600;
  line-height: ${lineHeight};
  ${getPadding}
`;

export class PopupControl extends React.PureComponent<ControlProps<any>> {
  render() {
    const {
      selectProps: { popupTitle },
    } = this.props;

    return (
      <ControlWrapper>
        <Label>{popupTitle}</Label>
        <components.Control {...this.props} />
      </ControlWrapper>
    );
  }
}

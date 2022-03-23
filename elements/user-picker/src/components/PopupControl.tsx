/** @jsx jsx */
import React from 'react';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';
import { gridSize } from '@atlaskit/theme/constants';
import { components, ControlProps } from '@atlaskit/select';
import { css, jsx } from '@emotion/core';
import { N200, DN90 } from '@atlaskit/theme/colors';

const spacing = gridSize();
const fontSize = 12;
const innerHeight = spacing * 2; // 16px
const lineHeight = innerHeight / fontSize;

const controlWrapper = css({
  display: 'flex',
  flexDirection: 'column',
  padding: `0px ${spacing}px ${spacing}px`,
});

const getColor = themed({
  light: token('color.text.subtlest', N200),
  dark: token('color.text.subtlest', DN90),
});

const getLabelStyle = () => {
  const right = 0;
  const bottom = spacing / 2;
  const left = 0;
  const top = spacing * 2.5;

  const color = getColor();

  return css({
    color,
    fontSize: `${fontSize}px`,
    fontWeight: 600,
    lineHeight: `${lineHeight}`,
    padding: `${top}px ${right}px ${bottom}px ${left}px`,
  });
};

export class PopupControl extends React.PureComponent<ControlProps<any>> {
  render() {
    const {
      selectProps: { popupTitle },
    } = this.props;

    return (
      <div css={controlWrapper}>
        <div css={getLabelStyle()}>{popupTitle}</div>
        <components.Control {...this.props} />
      </div>
    );
  }
}

import React, { Component } from 'react';

import { ClassNames } from '@emotion/core';

import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import Section from '../Section';

const gridSize = gridSizeFn();

export default class MenuSection extends Component {
  static defaultProps = {
    alwaysShowScrollHint: false,
  };

  render() {
    const { alwaysShowScrollHint, id, children, parentId } = this.props;
    return (
      <Section
        id={id}
        parentId={parentId}
        alwaysShowScrollHint={alwaysShowScrollHint}
        shouldGrow
      >
        {({ css }) => {
          const menuCss = {
            ...css,
            paddingBottom: gridSize * 1.5,
          };

          return (
            <ClassNames>
              {({ css: getClassName }) =>
                children({
                  css: menuCss,
                  className: getClassName(menuCss),
                })
              }
            </ClassNames>
          );
        }}
      </Section>
    );
  }
}

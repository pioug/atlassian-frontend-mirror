import React, { Component } from 'react';

import { ClassNames } from '@emotion/core';

import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import Section from '../Section';

const gridSize = gridSizeFn();

export default class HeaderSection extends Component {
  render() {
    const { children, id, parentId } = this.props;
    return (
      <Section id={id} key={id} parentId={parentId}>
        {({ css }) => {
          const headerCss = {
            ...css,
            paddingTop: gridSize * 2.5,
          };

          return (
            <ClassNames>
              {({ css: getClassName }) =>
                children({
                  css: headerCss,
                  className: getClassName(headerCss),
                })
              }
            </ClassNames>
          );
        }}
      </Section>
    );
  }
}

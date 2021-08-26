/** @jsx jsx */
import React, { Fragment } from 'react';

import { jsx } from '@emotion/core';

import Icon from '@atlaskit/icon';
import { CustomItemComponentProps } from '@atlaskit/menu';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { Footer } from '../../src';

import SampleIcon from './next-gen-project-icon';

const Container: React.FC<CustomItemComponentProps> = (props) => {
  return <div {...props} />;
};

// This example footer conforms to a design taken from Jira designs found at
// https://www.figma.com/file/GA22za6unqO2WsBWM0Ddxk/Jira-navigation-3?node-id=124%3A7194
const ExampleFooter = () => {
  const linkCSS = {
    fontSize: 12,
    color: token('color.text.lowEmphasis', N200),
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
      color: 'currentColor',
    },
    '&:active': {
      color: token('color.text.highEmphasis', N200),
    },
  };

  return (
    <Footer
      component={Container}
      description={
        <Fragment>
          <a css={linkCSS}>Give feedback</a> {' ∙ '}
          <a css={linkCSS}>Learn more</a>
        </Fragment>
      }
      iconBefore={<Icon label="mode" glyph={SampleIcon} />}
    >
      You're in a next-gen project
    </Footer>
  );
};

export default ExampleFooter;

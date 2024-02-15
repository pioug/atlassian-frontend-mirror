/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/react';

import { LinkButton } from '@atlaskit/button/new';
import Icon from '@atlaskit/icon';
import { CustomItemComponentProps } from '@atlaskit/menu';

import { Footer } from '../../src';

import SampleIcon from './next-gen-project-icon';

export const CustomItemFooter = ({
  children,
  ...props
}: CustomItemComponentProps) => {
  const Component = props.onClick ? 'a' : 'div';
  return (
    <Component
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...props}
    >
      {children}
    </Component>
  );
};

// This example footer conforms to a design taken from Jira designs found at
// https://www.figma.com/file/GA22za6unqO2WsBWM0Ddxk/Jira-navigation-3?node-id=124%3A7194
const ExampleFooter = () => (
  <Footer
    useDeprecatedApi={false}
    // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
    description={
      <Fragment>
        <LinkButton appearance="subtle-link" href="/feedback" spacing="none">
          Give feedback
        </LinkButton>
        {' ∙ '}
        <LinkButton appearance="subtle-link" href="/learn" spacing="none">
          Learn more
        </LinkButton>
      </Fragment>
    }
    iconBefore={<Icon label="mode" glyph={SampleIcon} />}
  >
    You're in a next-gen project
  </Footer>
);

export default ExampleFooter;

import React, { FC, ReactNode, ComponentType } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { createTheme } from '@atlaskit/theme/components';
import { borderRadius, gridSize, layers } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';
import { h600 } from '@atlaskit/theme/typography';
import { ThemeProp } from '@atlaskit/theme/components';
import { ActionItems, ActionItem } from '../styled/Dialog';
import { Actions } from '../types';

export interface CardTokens {
  container: Record<string, string | undefined>;
}

interface Props {
  /** Buttons to render in the footer */
  actions?: Actions;
  /** An optional element rendered to the left of the footer actions */
  actionsBeforeElement?: ReactNode;
  /** The content of the card */
  children?: ReactNode;
  /** The container elements rendered by the component */
  components?: {
    Header?: ComponentType<any>;
    Footer?: ComponentType<any>;
  };
  /** The heading to be rendered above the body */
  heading?: ReactNode;
  /** An optional element rendered to the right of the heading */
  headingAfterElement?: ReactNode;
  /** The image to render above the heading. Can be a url or a Node. */
  image?: string | ReactNode;
  /** the theme of the card */
  theme?: ThemeProp<CardTokens, {}>;

  innerRef?: React.Ref<HTMLElement>;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

const Container = styled.div`
  ${({ theme }) => theme};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${multiply(gridSize, 2)}px ${multiply(gridSize, 2.5)}px;
`;

const Heading = styled.h4`
  ${h600};
  color: inherit;
`;

const DefaultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: ${gridSize}px;
`;

const DefaultFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${gridSize}px;
`;

const Theme = createTheme<CardTokens, {}>(() => ({
  container: {
    overflow: 'auto',
    borderRadius: `${borderRadius()}px`,
    height: 'fit-content',
    zIndex: `${layers.spotlight() + 1}`,
  },
}));

const Card: FC<Props> = ({
  actions = [],
  actionsBeforeElement,
  children,
  components = {},
  image,
  heading,
  headingAfterElement,
  theme,
  innerRef,
  testId,
}) => {
  const { Header = DefaultHeader, Footer = DefaultFooter } = components;
  return (
    <Theme.Provider value={theme}>
      <Theme.Consumer>
        {({ container }) => {
          return (
            <Container
              theme={container}
              innerRef={innerRef!}
              data-testid={testId}
            >
              {typeof image === 'string' ? <img src={image} alt="" /> : image}
              <Body>
                {heading || headingAfterElement ? (
                  <Header>
                    <Heading>{heading}</Heading>
                    {/* Always need an element so space-between alignment works */}
                    {headingAfterElement || <span />}
                  </Header>
                ) : null}
                {children}
                {actions.length > 0 || actionsBeforeElement ? (
                  <Footer>
                    {/* Always need an element so space-between alignment works */}
                    {actionsBeforeElement || <span />}
                    <ActionItems>
                      {actions.map(({ text, key, ...rest }, idx) => {
                        return (
                          <ActionItem
                            key={
                              key ||
                              (typeof text === 'string' ? text : `${idx}`)
                            }
                          >
                            <Button {...rest}>{text}</Button>
                          </ActionItem>
                        );
                      })}
                    </ActionItems>
                  </Footer>
                ) : null}
              </Body>
            </Container>
          );
        }}
      </Theme.Consumer>
    </Theme.Provider>
  );
};

export default React.forwardRef<HTMLElement, Props>((props, ref) => (
  <Card {...props} innerRef={ref} />
));

/** @jsx jsx */
import React, { ComponentType, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import {
  createTheme,
  ThemeProp,
  useGlobalTheme,
} from '@atlaskit/theme/components';
import {
  borderRadius,
  gridSize as getGridSize,
  layers,
} from '@atlaskit/theme/constants';
import { h600 } from '@atlaskit/theme/typography';

import { DialogActionItem, DialogActionItemContainer } from '../styled/dialog';
import { Actions } from '../types';

export interface CardTokens {
  container: Record<string, string | undefined>;
}

interface CardProps {
  /**
   * Buttons to render in the footer
   */
  actions?: Actions;
  /**
   * An optional element rendered to the left of the footer actions
   */
  actionsBeforeElement?: ReactNode;
  /**
   * The content of the card
   */
  children?: ReactNode;
  /**
   * The container elements rendered by the component
   */
  components?: {
    Header?: ComponentType<any>;
    Footer?: ComponentType<any>;
  };
  /**
   * The heading to be rendered above the body
   */
  heading?: ReactNode;
  /**
   * An optional element rendered to the right of the heading
   */
  headingAfterElement?: ReactNode;
  /**
   * The image to render above the heading. Can be a url or a Node.
   */
  image?: string | ReactNode;
  /**
   * The theme of the card
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  theme?: ThemeProp<CardTokens, {}>;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

const gridSize = getGridSize();

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const lightH600Styles = css(h600({ theme: { mode: 'light' } }));
// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const darkH600Styles = css(h600({ theme: { mode: 'dark' } }));

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  theme: Record<string, string | undefined>;
};

const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ children, theme, ...props }, ref) => (
    // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
    <div css={theme} ref={ref as React.Ref<HTMLDivElement>} {...props}>
      {children}
    </div>
  ),
);

const bodyStyles = css({
  display: 'flex',
  padding: `${gridSize * 2}px ${gridSize * 2.5}px`,
  flexDirection: 'column',
});

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const headingStyles = css({
  color: 'inherit',
});

const defaultHeaderStyles = css({
  display: 'flex',
  paddingBottom: `${gridSize}px`,
  alignItems: 'baseline',
  justifyContent: 'space-between',
});

const DefaultHeader: React.FC<{}> = ({ children }) => (
  <div css={defaultHeaderStyles}>{children}</div>
);

const defaultFooterStyles = css({
  display: 'flex',
  paddingTop: `${gridSize}px`,
  alignItems: 'center',
  justifyContent: 'space-between',
});

const DefaultFooter: React.FC<{}> = ({ children }) => (
  <div css={defaultFooterStyles}>{children}</div>
);

const Theme = createTheme<CardTokens, {}>(() => ({
  container: {
    overflow: 'auto',
    borderRadius: `${borderRadius()}px`,
    height: 'fit-content',
    zIndex: `${layers.spotlight() + 1}`,
  },
}));

/**
 * __Card__
 *
 * A card base for the spotlight card. The external `SpotlightCard` wraps this component.
 *
 * @internal
 */
const Card = React.forwardRef<HTMLElement, CardProps>(
  (
    {
      actions = [],
      actionsBeforeElement,
      children,
      components = {},
      image,
      heading,
      headingAfterElement,
      theme,
      testId,
    },
    ref,
  ) => {
    const { Header = DefaultHeader, Footer = DefaultFooter } = components;
    const { mode } = useGlobalTheme();
    return (
      <Theme.Provider value={theme}>
        <Theme.Consumer>
          {({ container }) => {
            return (
              // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
              <Container theme={container} ref={ref} data-testid={testId}>
                {typeof image === 'string' ? <img src={image} alt="" /> : image}
                <div css={bodyStyles}>
                  {heading || headingAfterElement ? (
                    <Header>
                      <h4
                        css={[
                          mode === 'light' ? lightH600Styles : darkH600Styles,
                          headingStyles,
                        ]}
                      >
                        {heading}
                      </h4>
                      {headingAfterElement}
                    </Header>
                  ) : null}
                  {children}
                  {actions.length > 0 || actionsBeforeElement ? (
                    <Footer>
                      {/* Always need an element so space-between alignment works */}
                      {actionsBeforeElement || <span />}
                      <DialogActionItemContainer>
                        {actions.map(({ text, key, ...rest }, idx) => {
                          return (
                            <DialogActionItem
                              key={
                                key ||
                                (typeof text === 'string' ? text : `${idx}`)
                              }
                            >
                              <Button {...rest}>{text}</Button>
                            </DialogActionItem>
                          );
                        })}
                      </DialogActionItemContainer>
                    </Footer>
                  ) : null}
                </div>
              </Container>
            );
          }}
        </Theme.Consumer>
      </Theme.Provider>
    );
  },
);

export default Card;

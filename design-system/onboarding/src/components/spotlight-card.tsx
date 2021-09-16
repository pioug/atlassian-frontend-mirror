import React, { ComponentType, ReactNode, Ref } from 'react';

import { Theme as ButtonTheme } from '@atlaskit/button/custom-theme-button';
import { N0, N50A, N60A, P300 } from '@atlaskit/theme/colors';
import { ThemeProp } from '@atlaskit/theme/components';

import { Actions } from '../types';

import Card, { CardTokens } from './card';
import { spotlightButtonTheme } from './theme';

interface SpotlightCardProps {
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
   * The image src to render above the heading
   */
  image?: string | ReactNode;
  /**
   * Removes elevation styles if set
   */
  isFlat?: boolean;
  /**
   * The theme of the card
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  theme?: ThemeProp<CardTokens, {}>;
  /**
   * Width of the card in pixels
   */
  width?: number;

  innerRef?: Ref<HTMLElement> | null;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

class SpotlightCard extends React.Component<SpotlightCardProps> {
  static defaultProps = {
    width: 400,
    isFlat: false,
    components: {},
    theme: (themeFn: Function) => themeFn(),
  };

  render() {
    const {
      actions,
      actionsBeforeElement,
      children,
      components,
      isFlat,
      heading,
      headingAfterElement,
      image,
      innerRef,
      theme,
      width,
      testId,
    } = this.props;
    return (
      <ButtonTheme.Provider value={spotlightButtonTheme}>
        <Card
          testId={testId}
          ref={innerRef}
          heading={heading}
          headingAfterElement={headingAfterElement}
          actions={actions}
          actionsBeforeElement={actionsBeforeElement}
          components={components}
          image={image}
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
          theme={(parent) => {
            const { container, ...others } = parent({});
            return theme!(
              () => ({
                ...others,
                container: {
                  background: P300,
                  color: N0,
                  width: `${Math.min(Math.max(width!, 160), 600)}px`,
                  boxShadow: isFlat
                    ? undefined
                    : `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`, // AK-5598
                  ...container,
                },
              }),
              {},
            );
          }}
        >
          {children}
        </Card>
      </ButtonTheme.Provider>
    );
  }
}

/**
 * __Spotlight card__
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/onboarding)
 */
export default React.forwardRef<HTMLElement, SpotlightCardProps>(
  (props, ref) => <SpotlightCard {...props} innerRef={ref} />,
);

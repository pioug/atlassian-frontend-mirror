/* eslint-disable @repo/internal/react/consistent-props-definitions */
import React from 'react';

import Box from '@atlaskit/ds-explorations/box';
import Text from '@atlaskit/ds-explorations/text';
import warnOnce from '@atlaskit/ds-lib/warn-once';
import Stack from '@atlaskit/primitives/stack';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { overrideStyleFunction } from '../../common/styles';
import { Container, HeaderProps } from '../Header';
import { CustomItem } from '../Item';

type NewFooterProps = Omit<HeaderProps, 'cssFn' | 'component' | 'onClick'>;

type FooterFacadeProps =
  | (HeaderProps & {
      /**
       * @private
       * @deprecated
       */
      useDeprecatedApi?: true;
    })
  | (NewFooterProps & {
      /**
       * @private
       * @deprecated
       */
      useDeprecatedApi?: false;
      cssFn?: never;
      component?: never;
      onClick?: never;
    });

export type FooterProps = HeaderProps | NewFooterProps;

/**
 * __Footer__
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const OldFooter = (props: HeaderProps) => {
  const cssFn = overrideStyleFunction(
    () => ({
      userSelect: 'auto',
      display: 'block',
      textAlign: 'center',
      minHeight: '24px',
      alignItems: 'center',
      width: '100%',
      '[data-item-elem-before]': {
        marginRight: token('space.0', '0px'),
        marginBottom: token('space.100', '8px'),
        display: 'inline-block',
      },
      '[data-item-title]': {
        textAlign: 'center',
        fontSize: 12,
      },
      '[data-item-description]': {
        textAlign: 'center',
        display: 'inline-block',
        margin: token('space.075', '6px'),
      },
      // Will look interactive if the `component` is anything other than a div.
      'div&:hover': {
        backgroundColor: token(
          'color.background.neutral.subtle',
          'transparent',
        ),
        cursor: 'default',
      },
      'div&:active': {
        backgroundColor: token(
          'color.background.neutral.subtle',
          'transparent',
        ),
        color: token('color.text.subtle', N500),
      },
    }),
    props.cssFn,
  );

  // https://stackoverflow.com/a/39333479
  const safeProps = (({
    iconBefore,
    onClick,
    description,
    children,
    testId,
  }) => ({
    iconBefore,
    onClick,
    description,
    children,
    testId,
  }))(props);
  return (
    <CustomItem
      {...safeProps}
      component={props.component || Container}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      cssFn={cssFn}
    />
  );
};

/**
 * __Footer__
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const Footer = ({
  description,
  children,
  iconBefore,
  testId,
}: NewFooterProps) => {
  return (
    <Box display="block" padding="space.100" testId={testId}>
      <Stack space="space.100" alignInline="center">
        <Box display="inlineBlock" width="size.200" height="size.200">
          {iconBefore}
        </Box>
        <Stack space="space.075">
          <Text
            fontSize="size.075"
            textAlign="center"
            lineHeight="lineHeight.100"
          >
            {children}
          </Text>
          {description && (
            <Text
              lineHeight="lineHeight.100"
              as="div"
              fontSize="size.075"
              textAlign="center"
              color="subtlest"
            >
              {description}
            </Text>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

/**
 * __Footer__
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const FooterFacade = ({
  useDeprecatedApi = true,
  description,
  iconBefore,
  testId,
  children,
  component,
  cssFn,
  onClick,
}: FooterFacadeProps) => {
  if (!useDeprecatedApi) {
    return (
      <Footer iconBefore={iconBefore} description={description} testId={testId}>
        {children}
      </Footer>
    );
  }

  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'CI'
  ) {
    warnOnce(
      'The `@atlaskit/side-navigation` Footer has simplified its API, removing support for the `component`, `cssFn` and `onClick` props.\n\nThese props will stop working in a future major release. Reach out to #help-design-system on slack for help.',
    );
  }

  return (
    <OldFooter
      onClick={onClick}
      component={component}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      cssFn={cssFn}
      iconBefore={iconBefore}
      description={description}
      testId={testId}
    >
      {children}
    </OldFooter>
  );
};

export default FooterFacade;

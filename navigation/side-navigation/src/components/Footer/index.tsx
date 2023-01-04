import React from 'react';

import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { overrideStyleFunction } from '../../common/styles';
import { Container, HeaderProps as FooterProps } from '../Header';
import { CustomItem } from '../Item';

export type { FooterProps };

/**
 * __Footer__
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const Footer = (props: FooterProps) => {
  const cssFn = overrideStyleFunction(
    () => ({
      userSelect: 'auto',
      display: 'block',
      textAlign: 'center',
      minHeight: '24px',
      alignItems: 'center',
      width: '100%',
      '[data-item-elem-before]': {
        marginRight: token('spacing.scale.0', '0px'),
        marginBottom: token('spacing.scale.100', '8px'),
        display: 'inline-block',
      },
      '[data-item-title]': {
        textAlign: 'center',
        fontSize: 12,
      },
      '[data-item-description]': {
        textAlign: 'center',
        display: 'inline-block',
        margin: token('spacing.scale.075', '6px'),
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

export default Footer;

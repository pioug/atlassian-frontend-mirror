import React from 'react';

import { CustomItemComponentProps } from '@atlaskit/menu';

import { itemTextColor } from '../../common/constants';
import { overrideStyleFunction } from '../../common/styles';
import { HeaderProps } from '../Header';
import { CustomItem } from '../Item';

const Container: React.FC<CustomItemComponentProps> = props => {
  return <div {...props} />;
};

export type { HeaderProps as FooterProps } from '../Header';

const Footer = (props: HeaderProps) => {
  const cssFn = overrideStyleFunction(
    () => ({
      userSelect: 'auto',
      div: {
        display: 'block',
        textAlign: 'center',
        minHeight: '24px',
        alignItems: 'center',
        width: '100%',
      },
      ['[data-item-elem-before]']: {
        marginRight: 0,
        marginBottom: '8px',
        display: 'inline-block',
      },
      ['[data-item-title]']: {
        textAlign: 'center',
        fontSize: 12,
      },
      ['[data-item-description]']: {
        textAlign: 'center',
        display: 'inline-block',
        margin: '6px',
      },
      // Will look interactive if the `component` is anything other than a div.
      'div&:hover': {
        backgroundColor: 'transparent',
        cursor: 'default',
      },
      'div&:active': {
        backgroundColor: 'transparent',
        color: itemTextColor,
      },
    }),
    props.cssFn,
  );

  return (
    <CustomItem
      {...props}
      component={props.component || Container}
      cssFn={cssFn}
    />
  );
};

export default Footer;

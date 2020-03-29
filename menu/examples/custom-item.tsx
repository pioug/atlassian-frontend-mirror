/** @jsx jsx */
import { jsx } from '@emotion/core';
import { CustomItem, CustomItemComponentProps } from '../src';
import Slack from './icons/slack';
import Icon from '@atlaskit/icon';
import { colors } from '@atlaskit/theme';

const CustomComponent: React.FC<CustomItemComponentProps> = props => {
  return (
    // Make sure to use an interactive element instead of a div!
    <div className={props.wrapperClass}>{props.children}</div>
  );
};

export default () => (
  <CustomItem
    component={CustomComponent}
    elemBefore={<Icon glyph={Slack} label="" />}
    description="Next-gen software project"
    cssFn={currentStyles => {
      return {
        ...currentStyles,
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        ':before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          transform: 'translateX(-1px)',
          transition: 'transform 70ms ease-in-out',
          backgroundColor: colors.B100,
        },

        ':hover:before': {
          transform: 'translateX(0)',
        },
      };
    }}
  >
    Navigation System
  </CustomItem>
);

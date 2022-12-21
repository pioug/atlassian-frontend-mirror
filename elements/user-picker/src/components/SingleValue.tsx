/** @jsx jsx */
import { AvatarItem } from '@atlaskit/avatar';
import { css, jsx } from '@emotion/react';
import { Option } from '../types';
import { components, SingleValueProps } from '@atlaskit/select';
import { SizeableAvatar } from './SizeableAvatar';
import { getAvatarUrl } from './utils';

const avatarItemComponent = css({
  border: 'none !important',
  padding: '0 !important',
  width: 'auto',
  overflow: 'hidden',
  minWidth: '100px',
  '& > span': {
    boxSizing: 'border-box',
  },
  '&:hover': {
    width: 'auto',
    padding: 0,
    border: 'none',
  },
});

export type Props = SingleValueProps<Option>;

export const SingleValue = (props: Props) => {
  const {
    data: { label, data },
    selectProps: { appearance, isFocused },
  } = props;

  return !isFocused ? (
    <components.SingleValue {...props}>
      <AvatarItem
        backgroundColor="transparent"
        avatar={
          <SizeableAvatar
            src={getAvatarUrl(data)}
            appearance={appearance}
            name={label}
          />
        }
        primaryText={label}
      >
        {({ ref, ...props }) => <div css={avatarItemComponent} {...props} />}
      </AvatarItem>
    </components.SingleValue>
  ) : null;
};

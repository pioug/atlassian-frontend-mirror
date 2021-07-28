import { ElementType, ReactNode } from 'react';

import { Interpolation } from '@emotion/styled';

import { AnalyticsEvent } from '@atlaskit/analytics-next';
import { AvatarPropTypes } from '@atlaskit/avatar';

import { AvatarGroupItemProps } from './avatar-group-item';

export type DeepRequired<T> = {
  [P in keyof T]-?: Required<T[P]>;
};

export type AvatarProps = AvatarPropTypes & {
  name: string;
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  enableTooltip?: boolean;
  key?: string | number;
};

export interface AvatarGroupOverrides {
  AvatarGroupItem?: {
    render?: (
      Component: ElementType<AvatarGroupItemProps>,
      props: AvatarGroupItemProps,
      index: number,
    ) => ReactNode;
  };
  Avatar?: {
    render?: (
      Component: ElementType<AvatarProps>,
      props: AvatarProps,
      index: number,
    ) => ReactNode;
  };
}

export type onAvatarClickHandler = (
  event: React.MouseEvent,
  analyticsEvent: AnalyticsEvent | undefined,
  index: number,
) => void;

export type CssCallback = (
  template: TemplateStringsArray,
  ...args: Array<Interpolation>
) => string;

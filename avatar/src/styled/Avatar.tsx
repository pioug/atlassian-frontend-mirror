import React, { FC } from 'react';
import { ReactNode } from 'react';
import { Theme } from '../theme';
import { SizeType, AppearanceType } from '../types';

interface AvatarProps {
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
  size: SizeType;
  children: ReactNode;
  stackIndex?: number;
}

const Avatar: FC<AvatarProps> = props => (
  <Theme.Consumer {...props} includeBorderWidth>
    {({ dimensions }) => {
      return (
        <div
          data-testid={props.testId}
          style={{
            display: 'inline-block',
            position: 'relative',
            outline: 0,
            zIndex: props.stackIndex,
            ...dimensions,
          }}
        >
          {props.children}
        </div>
      );
    }}
  </Theme.Consumer>
);

export default Avatar;

interface PresenceWrapperProps {
  appearance: AppearanceType;
  size: SizeType;
  children: ReactNode;
}

export const PresenceWrapper: FC<PresenceWrapperProps> = props => (
  <Theme.Consumer {...props} includeBorderWidth>
    {({ presence }) => {
      return (
        <span
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            ...presence,
          }}
        >
          {props.children}
        </span>
      );
    }}
  </Theme.Consumer>
);

interface StatusWrapperProps {
  appearance: AppearanceType;
  size: SizeType;
  children: any;
}

export const StatusWrapper: FC<StatusWrapperProps> = props => (
  <Theme.Consumer {...props} includeBorderWidth>
    {({ status }) => {
      return (
        <span
          style={{
            position: 'absolute',
            ...status,
          }}
        >
          {props.children}
        </span>
      );
    }}
  </Theme.Consumer>
);

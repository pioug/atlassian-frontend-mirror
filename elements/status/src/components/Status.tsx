import React from 'react';
import { PureComponent } from 'react';
import Lozenge, { ThemeAppearance } from '@atlaskit/lozenge';
import {
  WithAnalyticsEventsProps,
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { createStatusAnalyticsAndFire } from './analytics';
import { ANALYTICS_HOVER_DELAY } from './constants';

export type Color = 'neutral' | 'purple' | 'blue' | 'red' | 'yellow' | 'green';
export type StatusStyle = 'bold' | 'subtle';

const colorToLozengeAppearanceMap: { [K in Color]: ThemeAppearance } = {
  neutral: 'default',
  purple: 'new',
  blue: 'inprogress',
  red: 'removed',
  yellow: 'moved',
  green: 'success',
};

const DEFAULT_APPEARANCE = 'default';
const MAX_WIDTH = 200;

export interface OwnProps {
  text: string;
  color: Color;
  style?: StatusStyle;
  localId?: string;
  onClick?: (event: React.SyntheticEvent<any>) => void;
  onHover?: () => void;
}

export type Props = OwnProps & WithAnalyticsEventsProps;

class StatusInternal extends PureComponent<Props, any> {
  static displayName = 'StatusInternal';

  private hoverStartTime: number = 0;

  private handleMouseEnter = (_e: React.MouseEvent<HTMLSpanElement>) => {
    this.hoverStartTime = Date.now();
  };

  private handleMouseLeave = (_e: React.MouseEvent<HTMLSpanElement>) => {
    const { onHover } = this.props;
    const delay = Date.now() - this.hoverStartTime;

    if (delay >= ANALYTICS_HOVER_DELAY && onHover) {
      onHover();
    }
    this.hoverStartTime = 0;
  };

  componentWillUnmount() {
    this.hoverStartTime = 0;
  }

  render() {
    const { text, color, style, onClick } = this.props;
    if (text.trim().length === 0) {
      return null;
    }

    const appearance = colorToLozengeAppearanceMap[color] || DEFAULT_APPEARANCE;
    // Note: ommitted data-local-id attribute to avoid copying/pasting the same localId
    return (
      <span
        className="status-lozenge-span"
        // Using title here as `@atlaskit/tooltip` adds too much overhead
        title={text}
        onClick={onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        data-node-type="status"
        data-color={color}
        data-style={style}
      >
        <Lozenge appearance={appearance} maxWidth={MAX_WIDTH}>
          {text}
        </Lozenge>
      </span>
    );
  }
}

export const Status = withAnalyticsEvents({
  onClick: (
    createEvent: CreateUIAnalyticsEvent,
    props: Props,
  ): UIAnalyticsEvent => {
    const { localId } = props;
    return createStatusAnalyticsAndFire(createEvent)({
      action: 'clicked',
      actionSubject: 'statusLozenge',
      attributes: {
        localId,
      },
    });
  },
  onHover: (
    createEvent: CreateUIAnalyticsEvent,
    props: Props,
  ): UIAnalyticsEvent => {
    const { localId } = props;
    return createStatusAnalyticsAndFire(createEvent)({
      action: 'hovered',
      actionSubject: 'statusLozenge',
      attributes: {
        localId,
      },
    });
  },
})(StatusInternal);

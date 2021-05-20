import React from 'react';
import { QS_ANALYTICS_EV_SUBMIT } from '../constants';
import ResultItem from '../ResultItem/ResultItem';
import { AnalyticsData, CommonResultProps } from './types';
import {
  ResultContext,
  SelectedResultIdContext,
  ResultContextType,
} from '../context';

export type Props = CommonResultProps & {
  /** Type of the result. This is passed as a parameter to certain callbacks. */
  type: string;
  /** Main text to be displayed as the item. */
  text: React.ReactNode;
  /** Text to be shown alongside the main `text`. */
  subText?: React.ReactNode;
  /** Text to appear to the right of the text. It has a lower font-weight. */
  caption?: string;
  /** React element to appear to the left of the text. */
  icon?: React.ReactNode;
  /** The context provided by QuickSearch. */
  context?: ResultContextType;
};

// context is an optional prop but the component provides a defaultProp. However, TS still complains
// when you don't pass it. There doesn't seem to be a better way of declaring optional default props.
type DefaultProps = {
  context: ResultContextType;
};

export class ResultBase extends React.PureComponent<DefaultProps & Props> {
  static defaultProps: Partial<Props> = {
    type: 'base',
    context: {
      registerResult: (result) => {},
      unregisterResult: (result) => {},
      onMouseEnter: (resultData) => {},
      onMouseLeave: () => {},
      // @ts-ignore
      sendAnalytics: (string, data) => {},
      getIndex: () => null,
    },
    analyticsData: {},
  };

  state = { isMouseSelected: false };

  registerResult() {
    const { context } = this.props;
    context.registerResult(this);
  }

  componentDidMount() {
    this.registerResult();
  }

  componentDidUpdate() {
    this.registerResult();
  }

  componentWillUnmount() {
    const { context } = this.props;
    context.unregisterResult(this);
  }

  public getAnalyticsData(): AnalyticsData {
    const { resultId, analyticsData, type, context } = this.props;
    return {
      index: context.getIndex(resultId),
      type,
      resultId,
      ...(analyticsData instanceof Function ? analyticsData() : analyticsData),
    };
  }

  handleClick = (e: MouseEvent) => {
    const { onClick, resultId, type, context } = this.props;

    if (context.sendAnalytics) {
      context.sendAnalytics(QS_ANALYTICS_EV_SUBMIT, {
        ...this.getAnalyticsData(),
        method: 'click',
        newTab: e && (e.metaKey || e.shiftKey || e.ctrlKey),
      });
    }

    if (onClick) {
      onClick({ resultId, type, event: e });
    }
  };

  handleMouseEnter = (event: MouseEvent) => {
    this.props.context.onMouseEnter({
      resultId: this.props.resultId,
      type: this.props.type,
      event,
    });
    this.setState({ isMouseSelected: true });
  };

  handleMouseLeave = () => {
    this.props.context.onMouseLeave();
    this.setState({ isMouseSelected: false });
  };

  render() {
    const {
      caption,
      elemAfter,
      selectedIcon,
      href,
      target,
      icon,
      isCompact,
      subText,
      text,
      resultId,
      context,
    } = this.props;

    const { isMouseSelected } = this.state;

    return (
      <SelectedResultIdContext.Consumer>
        {(selectedResultId) => (
          <ResultItem
            caption={caption}
            href={href}
            target={target}
            icon={icon}
            isCompact={isCompact}
            isSelected={resultId === selectedResultId}
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            isMouseSelected={isMouseSelected}
            subText={subText}
            text={text}
            textAfter={elemAfter}
            selectedIcon={selectedIcon}
            linkComponent={context.linkComponent}
          />
        )}
      </SelectedResultIdContext.Consumer>
    );
  }
}

export default (props: Props) => (
  <ResultContext.Consumer>
    {(context) => <ResultBase context={context} {...props} />}
  </ResultContext.Consumer>
);

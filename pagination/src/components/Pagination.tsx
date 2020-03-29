import React, { Component, Fragment, SyntheticEvent } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import PageComponent from './Page';
import { LeftNavigator, RightNavigator } from './Navigators';
import renderDefaultEllipsis from './renderEllipsis';
import collapseRangeHelper from '../util/collapseRange';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { PaginationPropTypes } from '../types';

interface State {
  selectedIndex: number;
}

class Pagination extends Component<PaginationPropTypes, State> {
  static defaultProps = {
    collapseRange: collapseRangeHelper,
    components: {},
    defaultSelectedIndex: 0,
    i18n: {
      prev: 'previous',
      next: 'next',
    },
    innerStyles: {},
    max: 7,
    onChange: () => {},
    renderEllipsis: renderDefaultEllipsis,
  };

  state = {
    selectedIndex: this.props.defaultSelectedIndex || 0,
  };

  static getDerivedStateFromProps(props: PaginationPropTypes) {
    // selectedIndex is controlled
    if (props.selectedIndex != null) {
      return {
        selectedIndex: props.selectedIndex,
      };
    }
    return null;
  }

  createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

  onChangeAnalyticsCaller = () => {
    const { createAnalyticsEvent } = this.props;

    if (createAnalyticsEvent) {
      return this.createAndFireEventOnAtlaskit({
        action: 'changed',
        actionSubject: 'pageNumber',

        attributes: {
          componentName: 'pagination',
          packageName,
          packageVersion,
        },
      })(createAnalyticsEvent);
    }
    return undefined;
  };

  onChange = (event: SyntheticEvent<any>, newSelectedPage: number) => {
    if (this.props.selectedIndex === undefined) {
      this.setState({
        selectedIndex: newSelectedPage,
      });
    }
    const analyticsEvent = this.onChangeAnalyticsCaller();
    if (this.props.onChange) {
      this.props.onChange(
        event,
        this.props.pages[newSelectedPage],
        analyticsEvent,
      );
    }
  };

  pagesToComponents = (pages: Array<any>) => {
    const { selectedIndex } = this.state;
    const { components, getPageLabel } = this.props;
    return pages.map((page, index) => {
      return (
        <PageComponent
          key={`page-${getPageLabel ? getPageLabel(page, index) : index}`}
          component={components!.Page}
          onClick={event => this.onChange(event, index)}
          isSelected={selectedIndex === index}
          page={page}
        >
          {getPageLabel ? getPageLabel(page, index) : page}
        </PageComponent>
      );
    });
  };

  renderPages = () => {
    const { selectedIndex } = this.state;
    const { pages, max, collapseRange, renderEllipsis } = this.props;
    const pagesComponents = this.pagesToComponents(pages);

    // @ts-ignore
    return collapseRange(pagesComponents, selectedIndex, {
      max: max!,
      ellipsis: renderEllipsis!,
    });
  };

  renderLeftNavigator = () => {
    const { components, pages, i18n } = this.props;
    const { selectedIndex } = this.state;
    const props = {
      'aria-label': i18n!.prev,
      pages,
    };

    return (
      <LeftNavigator
        key="left-navigator"
        component={components!.Previous}
        onClick={event => this.onChange(event, selectedIndex - 1)}
        isDisabled={selectedIndex === 0}
        {...props}
      />
    );
  };

  renderRightNavigator = () => {
    const { components, pages, i18n } = this.props;
    const { selectedIndex } = this.state;
    const props = {
      'aria-label': i18n!.next,
      pages,
    };
    return (
      <RightNavigator
        key="right-navigator"
        component={components!.Next}
        onClick={event => this.onChange(event, selectedIndex + 1)}
        isDisabled={selectedIndex === pages.length - 1}
        {...props}
      />
    );
  };

  render() {
    const { innerStyles } = this.props;

    return (
      <div style={{ display: 'flex', ...innerStyles }}>
        <Fragment>
          {this.renderLeftNavigator()}
          {this.renderPages()}
          {this.renderRightNavigator()}
        </Fragment>
      </div>
    );
  }
}

export default withAnalyticsContext({
  componentName: 'pagination',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(Pagination));

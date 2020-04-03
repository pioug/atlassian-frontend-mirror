/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
  overflowManagerNamespace,
  overflowGroupNamespace,
  shouldReportItemHeight,
  isArrayFilled,
} from './shared-variables';

export default class OverflowItemGroup extends Component {
  static childContextTypes = {
    [overflowGroupNamespace]: PropTypes.object,
  };

  static contextTypes = {
    [overflowManagerNamespace]: PropTypes.object,
    [shouldReportItemHeight]: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.heights = new Array(this.props.itemCount);
  }

  isInNavigation = () => !!this.context[shouldReportItemHeight];

  shouldRender = () => {
    const { overflowGroupIndex } = this.props;
    if (this.isInNavigation()) {
      return this.context[overflowManagerNamespace].isGroupVisibleInNav(
        overflowGroupIndex,
      );
    }
    return this.context[overflowManagerNamespace].isGroupVisibleInDropdown(
      overflowGroupIndex,
    );
  };

  shouldRenderItem = overflowItemIndex => {
    if (this.isInNavigation()) {
      return this.context[overflowManagerNamespace].isGroupItemVisibleInNav(
        this.props.overflowGroupIndex,
        overflowItemIndex,
      );
    }
    return this.context[overflowManagerNamespace].isGroupItemVisibleInDropdown(
      this.props.overflowGroupIndex,
      overflowItemIndex,
    );
  };

  hasAllItemHeights = () => isArrayFilled(this.heights);

  combinedItemHeights = () =>
    this.heights.reduce(
      (sum, value, i) => sum + (this.shouldRenderItem(i) ? value : 0),
      0,
    );

  nonItemHeight = () => this.groupHeight() - this.combinedItemHeights();

  groupHeight = () => (this.rootNode ? this.rootNode.clientHeight : 0);

  reportHeightsToOverflowManager = () => {
    if (!this.isInNavigation() || !this.rootNode || !this.hasAllItemHeights()) {
      return;
    }
    this.context[overflowManagerNamespace].reportGroupHeightToManager({
      groupIndex: this.props.overflowGroupIndex,
      itemHeights: this.heights,
      nonItemHeight: this.nonItemHeight(),
    });
  };

  handleItemHeightReport = (overflowItemIndex, height) => {
    this.heights[overflowItemIndex] = height;
    this.reportHeightsToOverflowManager();
  };

  getChildContext() {
    return {
      [overflowGroupNamespace]: {
        reportItemHeightToGroup: this.handleItemHeightReport,
        shouldRenderItem: this.shouldRenderItem,
      },
    };
  }

  handleRootNodeRef = ref => {
    this.rootNode = ref;
    this.reportHeightsToOverflowManager();
  };

  render() {
    if (!this.shouldRender()) {
      return null;
    }

    if (this.context[shouldReportItemHeight]) {
      return <div ref={this.handleRootNodeRef}>{this.props.children}</div>;
    }

    return this.props.children;
  }
}

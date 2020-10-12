// About the issue:
// > If you use the old drawer and add it into the new one it will work properly
// > but using @atlaskit/drawer it's not working properly

import React from 'react';
import { AkSearchDrawer } from '@atlaskit/navigation';
import Drawer from '@atlaskit/drawer';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import BasicQuickSearch from './utils/BasicQuickSearch';

type State = {
  isDrawerOpen: boolean;
  shouldUnmountOnExit: boolean;
  shouldRenderNewDrawer: boolean;
};

export default class IssueUsingDrawers extends React.Component<any, State> {
  state = {
    isDrawerOpen: false,
    shouldUnmountOnExit: true,
    shouldRenderNewDrawer: true,
  };

  quickSearchRef: any;

  openDrawer = () => {
    this.setState({
      isDrawerOpen: true,
    });
    if (
      this.quickSearchRef &&
      typeof this.quickSearchRef.focusSearchInput === 'function'
    ) {
      this.quickSearchRef.focusSearchInput();
    }
  };

  closeDrawer = () =>
    this.setState({
      isDrawerOpen: false,
    });

  toggleUnmountBehaviour = () => {
    this.setState(({ shouldUnmountOnExit: shouldUnmountOnExitValue }) => ({
      shouldUnmountOnExit: !shouldUnmountOnExitValue,
    }));
  };

  toggleWrapper = () => {
    this.setState(({ shouldRenderNewDrawer: shouldRenderNewDrawerValue }) => ({
      shouldRenderNewDrawer: !shouldRenderNewDrawerValue,
      shouldUnmountOnExit: shouldRenderNewDrawerValue,
    }));
  };

  setQuickSearchRef = (ref: any) => {
    if (ref) {
      this.quickSearchRef = ref.quickSearchInnerRef;
    }
  };

  render() {
    const Wrapper = this.state.shouldRenderNewDrawer ? Drawer : AkSearchDrawer;

    return (
      <div style={{ padding: '2rem' }}>
        <Wrapper
          onClose={this.closeDrawer}
          onBackButton={this.closeDrawer}
          backIcon={<ArrowLeftIcon label="Back icon" size="medium" />}
          isOpen={this.state.isDrawerOpen}
          key="search"
          primaryIcon={null}
          shouldUnmountOnExit={this.state.shouldUnmountOnExit}
        >
          <BasicQuickSearch ref={this.setQuickSearchRef} />
        </Wrapper>
        <button type="button" onClick={this.openDrawer}>
          Open drawer
        </button>
        <div style={{ marginTop: '2rem' }}>
          <label htmlFor="wrapper-checkbox">
            <input
              id="wrapper-checkbox"
              type="checkbox"
              value={this.state.shouldRenderNewDrawer + ''}
              onChange={this.toggleWrapper}
            />
            Use new Drawer component
          </label>
          <div style={{ display: 'block', paddingTop: '1rem' }}>
            Quick search is wrapped using drawer component from{' '}
            <strong>{`${
              this.state.shouldRenderNewDrawer
                ? '@atlaskit/drawer'
                : '@atlaskit/navigation-next'
            }`}</strong>{' '}
          </div>
        </div>
        {this.state.shouldRenderNewDrawer && (
          <div style={{ marginTop: '2rem' }}>
            <label htmlFor="checkbox">
              <input
                id="checkbox"
                type="checkbox"
                value={this.state.shouldUnmountOnExit + ''}
                onChange={this.toggleUnmountBehaviour}
              />
              Toggle remounting of drawer contents on exit
            </label>
            <div style={{ display: 'block', paddingTop: '1rem' }}>
              Contents of the drawer will be{' '}
              <strong>{`${
                this.state.shouldUnmountOnExit ? 'discarded' : 'retained'
              }`}</strong>{' '}
              on closing the drawer
            </div>
          </div>
        )}
      </div>
    );
  }
}

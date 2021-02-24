import {
  I18NWrapper,
  defaultCollectionName,
  defaultMediaPickerAuthProvider,
  userAuthProvider,
} from '@atlaskit/media-test-helpers';
import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { MediaPicker } from '../src';
import { Popup } from '../src/types';
import { intlShape } from 'react-intl';
import popupWarning from '../example-helpers/popup-warning';

const mediaClientConfig = {
  authProvider: defaultMediaPickerAuthProvider,
  userAuthProvider,
};

interface ExampleChildrenProps {}

// This class simulates a real integration where the React legacy context it's passed manually.
// That's pretty much what Editor does.
class ExampleChildren extends Component<ExampleChildrenProps, {}> {
  popup?: Popup;

  static contextTypes = {
    intl: intlShape,
    // Required context in order to integrate analytics in media picker
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
  };

  async componentDidMount() {
    await this.createMediaPicker(this.context);
    this.showMediaPicker();
  }

  async UNSAFE_componentWillReceiveProps(
    _: ExampleChildrenProps,
    nextContext: any,
  ) {
    if (this.context.intl !== nextContext.intl) {
      await this.createMediaPicker(nextContext);
    }
  }

  async createMediaPicker(reactContext: any) {
    this.popup = await MediaPicker(mediaClientConfig, {
      container: document.body,
      uploadParams: {
        collection: defaultCollectionName,
      },
      // Media picker requires `proxyReactContext` to enable analytics
      // otherwise, analytics Gasv3 integrations won't work
      proxyReactContext: reactContext,
    });
  }

  showMediaPicker = () => {
    if (this.popup) {
      this.popup.show();
    }
  };

  render() {
    return <button onClick={this.showMediaPicker}>Show Popup</button>;
  }
}

export default class Example extends Component<{}, {}> {
  render() {
    return (
      <div>
        {popupWarning}
        <I18NWrapper>
          <ExampleChildren />
        </I18NWrapper>
      </div>
    );
  }
}

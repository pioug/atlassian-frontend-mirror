import React from 'react';
import SectionMessage from '@atlaskit/section-message';

class AtlassianInternalWarning extends React.Component {
  render() {
    return (
      <SectionMessage
        title="Note: This component is designed for internal Atlassian development."
        appearance="warning"
      >
        <p>
          External contributors will be able to use this component but will not
          be able to submit issues.
        </p>
      </SectionMessage>
    );
  }
}

class DevPreviewWarning extends React.Component {
  render() {
    return (
      <SectionMessage
        title="Note: This component is currently in developer preview."
        appearance="warning"
      >
        <p>
          Please experiment with and test this package, but be aware that the
          API may change at any time. Use at your own risk, preferably not in
          production.
        </p>
      </SectionMessage>
    );
  }
}
export { AtlassianInternalWarning, DevPreviewWarning };

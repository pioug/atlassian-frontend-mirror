import React from 'react';
import { PureComponent } from 'react';
import { Status as AkStatus, Color } from '@atlaskit/status/element';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

export interface Props {
  text: string;
  color: Color;
  localId?: string;
}

export default class Status extends PureComponent<Props, {}> {
  render() {
    const { text, color, localId } = this.props;
    return (
      <FabricElementsAnalyticsContext
        data={{
          userContext: 'document',
        }}
      >
        <AkStatus text={text} color={color} localId={localId} />
      </FabricElementsAnalyticsContext>
    );
  }
}

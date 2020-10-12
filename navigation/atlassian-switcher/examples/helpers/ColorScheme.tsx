import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import { ThemingPublicApi } from '../../src/ui/theme/types';

type Props = {
  colorScheme: ThemingPublicApi;
};
export default class ColorScheme extends React.Component<Props> {
  render() {
    const colors = Object.entries(this.props.colorScheme).map(
      ([key, value]) => {
        return (
          <div
            style={{
              display: 'inline-block',
              margin: 5,
            }}
            key={key}
          >
            <Tooltip content={key}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: value,
                }}
              />
            </Tooltip>
          </div>
        );
      },
    );

    return <>{colors}</>;
  }
}

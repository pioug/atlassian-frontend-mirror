import React from 'react';
import { G300 } from '@atlaskit/theme/colors';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import { Flag } from '../src/types';

type RenderChildren = (
  showFlags: (flags: Array<Flag>) => void,
) => React.ReactNode;

type Props = {
  children: RenderChildren;
};

type State = {
  flags: Array<Flag>;
};

export default class AppWithFlag extends React.PureComponent<Props, State> {
  state = {
    flags: [],
  };

  handleDismiss = () => {
    this.setState((prevState: State) => ({
      flags: prevState.flags.slice(1),
    }));
  };

  addFlag = (flags: Array<Flag>) => {
    this.setState({ flags: [...this.state.flags, ...flags] });
  };

  render() {
    return (
      <>
        {this.props.children(this.addFlag)}
        <FlagGroup onDismissed={this.handleDismiss}>
          {this.state.flags.map((flag: Flag, index) => {
            return (
              <AutoDismissFlag
                appearance="normal"
                id={index}
                icon={
                  <SuccessIcon
                    label="Success"
                    size="medium"
                    primaryColor={G300}
                  />
                }
                key={index}
                title={flag.title.defaultMessage}
              />
            );
          })}
        </FlagGroup>
      </>
    );
  }
}

import React from 'react';
import { setEnv, SpacePicker } from '../src/index';

setEnv('local');

export default class PugSpacePicker extends React.Component {
  render() {
    return (
      <SpacePicker
        cloudId="DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5"
        contextType="picker"
      />
    );
  }
}

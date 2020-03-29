import React, { PureComponent } from 'react';
import FieldTextArea from '../src/FieldTextArea';

export default class ResizableExample extends PureComponent {
  render() {
    return (
      <div>
        <p>The field should not break outside the coloured flex container.</p>
        <div style={{ display: 'flex', width: 150, backgroundColor: '#fea' }}>
          <FieldTextArea isInvalid />
        </div>
      </div>
    );
  }
}

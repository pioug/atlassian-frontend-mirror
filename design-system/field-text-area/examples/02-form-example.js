import React, { Component } from 'react';
import Button from '@atlaskit/button/standard-button';
import FieldTextArea from '../src/FieldTextArea';

const formTestUrl = '//httpbin.org/get';

export default class FormExample extends Component {
  render() {
    return (
      <div>
        <form
          action={formTestUrl}
          method="get"
          style={{ backgroundColor: 'white' }}
          target="submitFrame"
        >
          <FieldTextArea
            label="Required with default value"
            required
            value="A default value"
            name="example-text"
          />

          <p>
            <Button type="submit" appearance="primary">
              Submit
            </Button>
          </p>
        </form>
        <p>The data submitted by the form will appear below:</p>
        <iframe
          src=""
          title="Checkbox Resopnse Frame"
          id="submitFrame"
          name="submitFrame"
          style={{
            width: '95%',
            height: '300px',
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            boxSizing: 'border-box',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        />
      </div>
    );
  }
}

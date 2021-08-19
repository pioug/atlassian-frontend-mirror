/**  @jsx jsx */
import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import { Checkbox } from '../src';

const formTestUrl = '//httpbin.org/get';

export default function CheckboxGroupExample() {
  return (
    <div>
      <form action={formTestUrl} method="get" target="submitFrame">
        <span>
          <Checkbox label="One" value="One" name="one" />
          <Checkbox label="Two" value="two" name="two" />
          <Checkbox label="Three" value="Three" name="three" />
        </span>

        <p>
          When checkboxes have the same name their values are grouped when
          submitted.
        </p>

        <span>
          <Checkbox
            label="Same Name - One"
            value="Same Name - One"
            name="same-name"
          />
          <Checkbox
            label="Same Name - Two"
            value="Same Name - Two"
            name="same-name"
          />
          <Checkbox
            label="Same Name - Three"
            value="Same Name - Three"
            name="same-name"
          />
        </span>
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
        css={{
          width: '95%',
          height: '300px',
          borderStyle: 'dashed',
          borderWidth: '1px',
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          borderColor: '#ccc',
          boxSizing: 'border-box',
          padding: '0.5em',
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          color: '#ccc',
          margin: '0.5em',
        }}
      />
    </div>
  );
}

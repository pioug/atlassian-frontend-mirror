import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `REPORT zexample.

DATA: lv_name TYPE string,
      lv_age  TYPE i.

START-OF-SELECTION.
  lv_name = 'John Doe'.
  lv_age = 30.
  WRITE: / 'Name:', lv_name,
         / 'Age:', lv_age.`;

export default function ExampleABAP() {
	return (
		<div>
			<h2>ABAP</h2>
			<CodeBlock language="ABAP" text={exampleCodeBlock} />
		</div>
	);
}

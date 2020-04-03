import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`

This page covers validation which occurs in real time on fields, and validation which occurs upon submission.

The most relevant props for validation are \`error\` and \`valid\`, passed down by the Field component to its children.
These have been constructed in such a way that they can be used to determine the validation state in most use cases.
If a more complex use case is required, there is further Field state information in the \`meta\` prop.

<a name="field-validation"></a>

## Field-level validation [#](#field-validation)

A field's value can be validated by using the \`validate\` prop. This prop accepts
a function that is called whenever a field value changes. The validation function
gets passed the current field value and form state. If the validation fails,
return the error. Otherwise, return undefined.

${(
  <Example
    packageName="@atlaskit/form"
    Component={require('../examples/05-field-validation').default}
    title="Field validation"
    source={require('!!raw-loader!../examples/05-field-validation')}
  />
)}

If the validation requires an async check, the validation function can return a Promise. Note
that the promise should **resolve** with the error, rather than reject with the error.


<a name="submission-validation"></a>

## Submission validation [#](#submission-validation)

When the form gets submitted, the current state gets passed to the onSubmit handler.
You communicate submission errors in a similar way to field-level validation.
If there was a submission error, the onSubmit handler should return an object.
Say there was a problem with the "password" field, the object should contain that
key and the error as the value.

If the submission succeeded, the onSubmit handler should return undefined.

${(
  <Example
    packageName="@atlaskit/form"
    Component={require('../examples/10-submission-validation').default}
    title="Submission validation"
    source={require('!!raw-loader!../examples/10-submission-validation')}
  />
)}

The onSubmit handler can return synchronously or a Promise that resolves to the result. Note that
the promise should **resolve** with the error, rather than reject with the error.

`;

import React from 'react';
import Editor from './../src/editor';

export default function Example() {
  return (
    <div>
      <p>
        The most basic editor possible. Editor you get by rendering{' '}
        {'<Editor/>'} component with no props.
      </p>
      <Editor />
    </div>
  );
}

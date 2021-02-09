import React from 'react';

import { CodeBlock } from '../src';

const exampleCodeBlock = `(ns learnclojure)
(str "Hello" " " "World") ; => "Hello World"`;

export default function Component() {
  return (
    <div>
      <h2>Clojure</h2>
      <CodeBlock language="clojure" text={exampleCodeBlock} />
    </div>
  );
}

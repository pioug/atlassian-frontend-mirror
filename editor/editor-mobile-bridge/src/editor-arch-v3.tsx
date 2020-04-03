import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import MobileEditor from './labs/mobile-editor-element';
import { determineMode, IS_DEV } from './utils';

function main() {
  const params = new URLSearchParams(window.location.search);
  const mode = determineMode(params.get('mode'));

  // Read default value from defaultValue query parameter when in development
  const rawDefaultValue = IS_DEV ? params.get('defaultValue') : null;
  const defaultValue =
    IS_DEV && rawDefaultValue ? atob(rawDefaultValue) : undefined;

  ReactDOM.render(
    <MobileEditor mode={mode} defaultValue={defaultValue} />,
    document.getElementById('editor'),
  );
}

window.addEventListener('DOMContentLoaded', main);

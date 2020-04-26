import React from 'react';

import { Subscribe } from 'unstated';

import UIController from './UIController';

const to = [UIController];

const UIControllerSubscriber = ({ children }) => (
  <Subscribe to={to}>{children}</Subscribe>
);

export default UIControllerSubscriber;

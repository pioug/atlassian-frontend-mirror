import React from 'react';

import { Subscribe } from 'unstated';

import ViewController from './ViewController';

const to = [ViewController];

const ViewControllerSubscriber = (props) => <Subscribe to={to} {...props} />;

export default ViewControllerSubscriber;

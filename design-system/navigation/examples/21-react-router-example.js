import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import TitledPage from './utils/react-router/PageNavigation';

export default () => (
  <Router>
    <Switch>
      <Route
        render={() => (
          <TitledPage title="Container home" currentPath="/iframe.html" />
        )}
        path="/iframe.html"
      />
      <Route
        render={() => <TitledPage title="Page 1" currentPath="/page1" />}
        path="/page1"
      />
      <Route
        render={() => <TitledPage title="Page 2" currentPath="/page2" />}
        path="/page2"
      />
      <Route
        render={() => <TitledPage title="Page 3" currentPath="/page3" />}
        path="/page3"
      />
      <Route
        render={() => <TitledPage title="Page 4" currentPath="/page4" />}
        path="/page4"
      />
      <Route
        render={() => (
          <TitledPage title="Container home" currentPath="/iframe.html" />
        )}
      />
    </Switch>
  </Router>
);

import React from 'react';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

export default () => (
  <div>
    <Warning />
    <h1>Lozenges</h1>
    <p>
      Use lozenges to highlight an item&rsquo;s status for quick recognition.
    </p>
    <p>
      Eg. here are some{' '}
      <span className="ak-lozenge ak-lozenge__appearance-new">new</span>{' '}
      components.
    </p>
    <table>
      <thead>
        <th>default</th>
        <th>bold</th>
      </thead>
      <tbody>
        <tr>
          <td>
            <span className="ak-lozenge ak-lozenge__appearance-default">
              default
            </span>
          </td>
          <td>
            <span className="ak-lozenge ak-lozenge__appearance-default-bold">
              bold-bold
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span className="ak-lozenge ak-lozenge__appearance-moved">
              moved
            </span>
          </td>
          <td>
            <span className="ak-lozenge ak-lozenge__appearance-moved-bold">
              moved-bold
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span className="ak-lozenge ak-lozenge__appearance-new">new</span>
          </td>
          <td>
            <span className="ak-lozenge ak-lozenge__appearance-new-bold">
              new-bold
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span className="ak-lozenge ak-lozenge__appearance-removed">
              removed
            </span>
          </td>
          <td>
            <span className="ak-lozenge ak-lozenge__appearance-removed-bold">
              removed-bold
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span className="ak-lozenge ak-lozenge__appearance-success">
              success
            </span>
          </td>
          <td>
            <span className="ak-lozenge ak-lozenge__appearance-success-bold">
              success-bold
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

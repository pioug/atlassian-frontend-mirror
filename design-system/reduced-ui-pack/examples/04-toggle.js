import React from 'react';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

export default () => (
  <div>
    <Warning />
    <table>
      <thead>
        <tr>
          <th>Style</th>
          <th>Default size</th>
          <th>Large size</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Unchecked</td>
          <td>
            <div className="ak-field-toggle ak-field-toggle__size-default">
              <input
                type="checkbox"
                name="default-unchecked"
                id="default-unchecked"
                value="default-unchecked"
              />
              <label htmlFor="default-unchecked">Option</label>
            </div>
          </td>
          <td>
            <div className="ak-field-toggle ak-field-toggle__size-large">
              <input
                type="checkbox"
                name="large-unchecked"
                id="large-unchecked"
                value="large-unchecked"
              />
              <label htmlFor="large-unchecked">Option</label>
            </div>
          </td>
        </tr>
        <tr>
          <td>Checked</td>
          <td>
            <div className="ak-field-toggle ak-field-toggle__size-default">
              <input
                type="checkbox"
                name="default-checked"
                id="default-checked"
                value="default-checked"
                defaultChecked
              />
              <label htmlFor="default-checked">Option</label>
            </div>
          </td>
          <td>
            <div className="ak-field-toggle ak-field-toggle__size-large">
              <input
                type="checkbox"
                name="large-checked"
                id="large-checked"
                value="large-checked"
                defaultChecked
              />
              <label htmlFor="large-checked">Option</label>
            </div>
          </td>
        </tr>
        <tr>
          <td>Unchecked (disabled)</td>
          <td>
            <div className="ak-field-toggle ak-field-toggle__size-default">
              <input
                type="checkbox"
                name="default-unchecked-disabled"
                id="default-unchecked-disabled"
                value="default-unchecked-disabled"
                disabled
              />
              <label htmlFor="default-unchecked-disabled">Option</label>
            </div>
          </td>
          <td>
            <div className="ak-field-toggle ak-field-toggle__size-large">
              <input
                type="checkbox"
                name="large-unchecked-disabled"
                id="large-unchecked-disabled"
                value="large-unchecked-disabled"
                disabled
              />
              <label htmlFor="large-unchecked-disabled">Option</label>
            </div>
          </td>
        </tr>
        <tr>
          <td>Checked (disabled)</td>
          <td>
            <div className="ak-field-toggle ak-field-toggle__size-default">
              <input
                type="checkbox"
                name="default-checked-disabled"
                id="default-checked-disabled"
                value="default-checked-disabled"
                defaultChecked
                disabled
              />
              <label htmlFor="default-checked-disabled">Option</label>
            </div>
          </td>
          <td>
            <div className="ak-field-toggle ak-field-toggle__size-large">
              <input
                type="checkbox"
                name="large-checked-disabled"
                id="large-checked-disabled"
                value="large-checked-disabled"
                defaultChecked
                disabled
              />
              <label htmlFor="large-checked-disabled">Option</label>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

import React from 'react';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

export default () => (
  <div>
    <Warning />
    <ak-grid is>
      <ak-grid-column is size="8">
        <h1>Main heading</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </ak-grid-column>
      <ak-grid-column is size="4">
        <h2>Sidebar</h2>
        <p>
          Blanditiis voluptatum perspiciatis doloribus dignissimos accusamus
          commodi, nobis ut, error iusto, quas vitae nesciunt consequatur
          possimus labore!
        </p>
      </ak-grid-column>
      <ak-grid-column is>
        <h2>Content below which takes up remaining space</h2>
        <p>
          Blanditiis voluptatum perspiciatis doloribus dignissimos accusamus
          commodi, nobis ut, error iusto, quas vitae nesciunt consequatur
          possimus labore! Mollitia est quis minima asperiores.
        </p>
      </ak-grid-column>
    </ak-grid>
  </div>
);

import React from 'react';

import { Link } from 'react-router-dom';

import { AtlassianInternalWarning, md } from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  A React component to display a card with user information.

  Go to one of the sub-pages for more detailed explanations of what you're looking for.

${(
  <ul>
    <li>
      <Link to="profilecard/docs/profilecard-trigger">
        To display User profile cards
      </Link>
    </li>
    <li>
      <Link to="profilecard/docs/team-profilecard">
        To display Team profile cards
      </Link>
    </li>
    <li>
      <Link to="profilecard/docs/profile-client">
        To customise the behaviour of the profile client, e.g. fetching data
        from a custom source.
      </Link>
    </li>
  </ul>
)}

`;

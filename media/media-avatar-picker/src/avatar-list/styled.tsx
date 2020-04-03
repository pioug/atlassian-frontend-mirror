import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';

export const AvatarListWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  ul {
    display: flex;

    padding: 0;
    margin: 0;

    list-style-type: none;

    li {
      padding-right: 5px;
      margin: 0;
    }
  }

  /* hide tickbox and file type icon in overlay
   * because those are not necessary for avatars */

  .tickbox {
    visibility: hidden;
  }

  .file-type-icon {
    visibility: hidden;
  }
`;

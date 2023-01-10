import { code, md } from '@atlaskit/docs';

export default md`

## Description

The purpose of the **normalizeUrl** is to transform a URL into a normalised canonical URL.

It also can be used to identify whether a string is a valid URL or not.
If a passed string doesn't match defined URL patterns it returns **null**

The purpose of the **isSafeUrl** is to identify if a URL matches a white-listed URL patterns.

  ## Installation

  ${code`yarn add @atlaskit/linking-common`}


  ## Usage

  ${code`
    import { normalizeUrl, isSafeUrl } from '@atlaskit/linking-common/url';

    const normalizedUrl = normalizeUrl('atlassian.com');

    if(isSafeUrl(url)) { ... }
  `}

  ${code`
  type normalizeUrl = (url?: string | null): string | null
  type isSafeUrl = (url: string): boolean
  `}
`;

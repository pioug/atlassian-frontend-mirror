import React from 'react';
import { Component } from 'react';
import { StyledIcon, StyledSvgGroup } from './styled';

export class UploadIcon extends Component {
  render() {
    // TODO: Use Atlaskit color
    // https://product-fabric.atlassian.net/browse/MSW-156
    return (
      <StyledIcon
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <StyledSvgGroup
          id="Symbols"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
        >
          <StyledSvgGroup id="Upload-cloud-active" fill="#165ECC">
            <path
              d="M13,13.769312 L15.4995642,13.769312 C15.7692032,13.769312 15.8594741,13.5936547 15.6861267,13.3769704 L12.1240983,8.92443488 C12.0565453,8.83999358 11.9444393,8.83876288 11.8759017,8.92443488 L8.31387329,13.3769704 C8.14236212,13.5913594 8.22405275,13.769312 8.50043583,13.769312 L11,13.769312 L11,16.7978014 C11,16.9132156 11.0891309,17 11.1990795,17 L12.8009205,17 C12.9140625,17 13,16.9094726 13,16.7978014 L13,13.769312 Z M6,20 C3.23857625,20 1,17.7614237 1,15 C1,12.580468 2.71857515,10.5623307 5.00162508,10.0996885 C5.00054449,10.0665918 5,10.0333595 5,10 C5,8.34314575 6.34314575,7 8,7 C8.4650862,7 8.90545376,7.10583308 9.2983335,7.29473006 C9.99550814,5.37293414 11.8374211,4 14,4 C16.7614237,4 19,6.23857625 19,9 C19,9.37003761 18.9598026,9.73068663 18.8835364,10.0778186 C21.2235498,10.4950422 23,12.540065 23,15 C23,17.7614237 20.7614237,20 18,20 L6,20 Z"
              id="Combined-Shape"
            />
          </StyledSvgGroup>
        </StyledSvgGroup>
      </StyledIcon>
    );
  }
}

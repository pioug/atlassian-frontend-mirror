/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import ChildIssuesIcon from '@atlaskit/icon/glyph/child-issues';

const rotateSvg = css({
  transform: 'rotate(180deg)',
  display: 'inline-block',
});

/**
 * ChildIssuesIcon but 180 degrees rotated
 */
const RelatedLinksActionIcon = () => (
  <span css={rotateSvg}>
    <ChildIssuesIcon label="View recent links..." />
  </span>
);

export default RelatedLinksActionIcon;

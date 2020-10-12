import evaluateInner from './utils/evaluate-inner';

export default evaluateInner`
  /* IE11 doesn't support <template> elements which shouldn't be displayed */
  template {
    display: none;
  }

  /* IE11 and some older browsers don't support these elements yet and treat them as display: inline; */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  main,
  menu,
  nav,
  section {
    display: block;
  }

  /* Suppress the ugly broken image styling in Firefox */
  @-moz-document url-prefix() {
    img {
      font-size: 0;
    }
    img:-moz-broken {
      font-size: inherit;
    }
  }

/*
  Chrome 83.0.4103.61 introduced a new user-agent style that broke all buttons for us. This default override reverts it.
  chrome user agent added this => font: 400 13.3333px Arial;
*/
button {
  font-family: inherit;
}
`;

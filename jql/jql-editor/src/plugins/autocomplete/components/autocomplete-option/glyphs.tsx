import React from 'react';

// Custom icons not from Atlaskit

export const numberGlyph = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm.417 10.636h1.15V9.141H7.42L6 10.12v1.07l1.348-.93h.069v4.376zm1.923-3.85v.02h1.067v-.024c0-.506.365-.857.898-.857.503 0 .861.313.861.755 0 .357-.194.643-.967 1.397l-1.794 1.756v.803h3.964v-.955h-2.406v-.069l1.05-1.002c.953-.895 1.277-1.409 1.277-2.007 0-.944-.8-1.603-1.947-1.603-1.188 0-2.003.724-2.003 1.786zm5.811 1.466h.682c.617 0 .994.297.994.777 0 .469-.4.792-.975.792-.59 0-.983-.293-1.017-.757h-1.1c.05 1.035.88 1.713 2.106 1.713 1.253 0 2.159-.697 2.159-1.66 0-.724-.472-1.226-1.226-1.31v-.069c.613-.125 1.013-.62 1.013-1.257 0-.864-.811-1.481-1.939-1.481-1.2 0-1.972.655-2.01 1.695H14.9c.03-.476.385-.777.918-.777.537 0 .88.282.88.723 0 .45-.355.754-.876.754h-.67v.857z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

// Following same approach as SWIFT page in Jira Frontend:
// Most glyphs in the Atlaskit icon package are 20x20 on a 24px canvas, however there are several icons we use which do
// not match these dimensions. We've copied these icons and standardised them to fit within a 16x16 box on a 24px canvas
// to remain visually consistent. See jira-frontend/src/packages/project-settings/common/src/glyphs.js for more details.

export const checkboxGlyph = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      d="M4 5.994C4 4.893 4.895 4 5.994 4h12.012C19.107 4 20 4.895 20 5.994v12.012A1.995 1.995 0 0 1 18.006 20H5.994A1.995 1.995 0 0 1 4 18.006V5.994zm5.707 5.299a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L11 12.586l-1.293-1.293z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const dateGlyph = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      d="M8.667 6.167V7A.834.834 0 0 1 7 7V5.333a.834.834 0 0 1 1.667 0v.834zm6.666 0v-.834a.834.834 0 0 1 1.667 0V7a.834.834 0 0 1-1.667 0v-.833zm2.5 0h.005c.918 0 1.662.745 1.662 1.661v10.01c0 .918-.743 1.662-1.662 1.662H6.161A1.663 1.663 0 0 1 4.5 17.838V7.828c0-.917.743-1.661 1.662-1.661h.005V7c0 .927.746 1.667 1.666 1.667C8.76 8.667 9.5 7.92 9.5 7v-.833h5V7c0 .927.746 1.667 1.667 1.667.927 0 1.666-.747 1.666-1.667v-.833zm-10 6.667H9.5v-1.667H7.833v1.667zm0 3.334H9.5V14.5H7.833v1.668zm3.334-3.334h1.666v-1.667h-1.666v1.667zm0 3.334h1.666V14.5h-1.666v1.668zm3.333-3.334h1.667v-1.667H14.5v1.667zm0 3.334h1.667V14.5H14.5v1.668z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const dropdownGlyph = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      d="M12 19.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm.65-5.268l2.44-2.463a.84.84 0 0 0 0-1.182.822.822 0 0 0-1.17 0l-1.916 1.93-1.922-1.939a.824.824 0 0 0-1.173 0 .842.842 0 0 0 0 1.183l2.45 2.47a.92.92 0 0 0 .649.269.9.9 0 0 0 .641-.268z"
      fill="currentColor"
    />
  </svg>
);

export const labelGlyph = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      d="M11.433 5.428l-4.207.6a2 2 0 0 0-1.697 1.698l-.601 4.207a1 1 0 0 0 .283.849l6.894 6.894a1 1 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0 0-1.414L12.282 5.71a1 1 0 0 0-.849-.283zm-.647 5.858a1.667 1.667 0 1 1-2.357-2.357 1.667 1.667 0 0 1 2.357 2.357z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const paragraphGlyph = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      d="M7 7h11a1 1 0 0 1 0 2H7a1 1 0 1 1 0-2zm0 4h11a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm0 4h6a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const peopleGlyph = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      d="M12.12 20.249a8.398 8.398 0 0 1-.39-.003A8.25 8.25 0 0 1 3.75 12 8.25 8.25 0 0 1 12 3.75 8.25 8.25 0 0 1 20.25 12a8.25 8.25 0 0 1-8.13 8.25v-.001zm4.463-3.762A6.396 6.396 0 0 0 18.417 12 6.424 6.424 0 0 0 12 5.583 6.424 6.424 0 0 0 5.583 12c0 1.745.7 3.33 1.834 4.487v-1.27a2.291 2.291 0 0 1 2.292-2.292h4.582a2.292 2.292 0 0 1 2.292 2.291v1.27zM12 12a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const shortTextGlyph = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      d="M6.72 7.178l-2.93 8.627a.5.5 0 0 0 .473.661h.842a.75.75 0 0 0 .716-.53l.581-1.887h3.425l.58 1.887a.75.75 0 0 0 .717.53h.916a.5.5 0 0 0 .473-.66L9.578 7.177a1 1 0 0 0-.946-.678h-.966a1 1 0 0 0-.947.678zm1.37 1.228h.047l1.25 4.082H6.841l1.25-4.082zm10.187 1.872v-.23a.986.986 0 1 1 1.972 0v5.433a.986.986 0 0 1-1.972 0v-.217h-.08c-.36.802-1.13 1.32-2.217 1.32-1.81 0-2.952-1.479-2.952-3.834 0-2.334 1.149-3.805 2.952-3.805 1.075 0 1.858.546 2.216 1.333h.08zm-.04 2.486c0-1.347-.63-2.203-1.61-2.203-.978 0-1.58.843-1.58 2.203 0 1.368.602 2.196 1.58 2.196.988 0 1.61-.836 1.61-2.196z"
      fill="currentColor"
    />
  </svg>
);

export const timeStampGlyph = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      d="M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.787-7.674V8.944c0-.52-.402-.944-.893-.944-.492 0-.894.425-.894.944v3.777c0 .263.104.5.269.672l2.207 2.332a.862.862 0 0 0 1.263 0 .985.985 0 0 0 0-1.336l-1.952-2.063z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

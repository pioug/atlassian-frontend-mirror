import evaluateInner from './utils/evaluate-inner';

export default evaluateInner`
  ak-grid {
    align-content: flex-start;
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    max-width: 960px;
    padding: 0 8px;
    position: relative;
  }
  ak-grid[layout='fluid'] {
    max-width: 100%;
  }
  ak-grid-column {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;
    margin: 0 8px;
    max-width: calc(100% - 16px);
    min-width: calc(99.9999% / 12 - 16px);
    word-wrap: break-word;
  }
  ak-grid-column[size='1'] {
    flex-basis: calc(99.9999% / 12 * 1 - 16px);
    max-width: calc(99.9999% / 12 * 1 - 16px);
  }
  ak-grid-column[size='2'] {
    flex-basis: calc(99.9999% / 12 * 2 - 16px);
    max-width: calc(99.9999% / 12 * 2 - 16px);
  }
  ak-grid-column[size='3'] {
    flex-basis: calc(99.9999% / 12 * 3 - 16px);
    max-width: calc(99.9999% / 12 * 3 - 16px);
  }
  ak-grid-column[size='4'] {
    flex-basis: calc(99.9999% / 12 * 4 - 16px);
    max-width: calc(99.9999% / 12 * 4 - 16px);
  }
  ak-grid-column[size='5'] {
    flex-basis: calc(99.9999% / 12 * 5 - 16px);
    max-width: calc(99.9999% / 12 * 5 - 16px);
  }
  ak-grid-column[size='6'] {
    flex-basis: calc(99.9999% / 12 * 6 - 16px);
    max-width: calc(99.9999% / 12 * 6 - 16px);
  }
  ak-grid-column[size='7'] {
    flex-basis: calc(99.9999% / 12 * 7 - 16px);
    max-width: calc(99.9999% / 12 * 7 - 16px);
  }
  ak-grid-column[size='8'] {
    flex-basis: calc(99.9999% / 12 * 8 - 16px);
    max-width: calc(99.9999% / 12 * 8 - 16px);
  }
  ak-grid-column[size='9'] {
    flex-basis: calc(99.9999% / 12 * 9 - 16px);
    max-width: calc(99.9999% / 12 * 9 - 16px);
  }
  ak-grid-column[size='10'] {
    flex-basis: calc(99.9999% / 12 * 10 - 16px);
    max-width: calc(99.9999% / 12 * 10 - 16px);
  }
  ak-grid-column[size='11'] {
    flex-basis: calc(99.9999% / 12 * 11 - 16px);
    max-width: calc(99.9999% / 12 * 11 - 16px);
  }
  ak-grid-column[size='12'] {
    flex-basis: calc(100% - 16px);
    max-width: calc(100% - 16px);
  }
`;

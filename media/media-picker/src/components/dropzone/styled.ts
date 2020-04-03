// TODO [MSW-385]: Migrate into SC

export const wrapperStyles = `
  .mp-title {
    font-weight: 500;
    font-size: 40px;
    margin-bottom: 20px;
  }

  .mp-description {
    font-size: 16px;
    font-weight: 500;
  }

  .mp-fileIcon {
    width: auto;
    height: 200px;
    position: absolute;
    bottom: 0;
    transform-origin: bottom;
    left: 150px;
  }

  .mp-iconAtlassianDoc {
    left: 100px;
    width: 183px;
    height: 212px;
    bottom: -15px;
    animation: atlassian-doc .75s .2s forwards;
  }

  .mp-iconOtherDoc {
    left: 170px;
    z-index: 1;
    width: 173px;
    height: 224px;
  }

  .mp-iconPageSpreadsheet {
    left: 250px;
    animation: spreadsheet .75s .2s forwards;
  }

  .mp-text {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    left: 0;
    right: 0;
    top: 130px;
    position: absolute;
    text-align: center;
  }

  .mp-text span {
    display: block;
  }

  .mp-circle {
    transition: width 0.2s ease,
    height 0.2s ease,
    top 0.2s ease,
    left 0.2s ease;
    width: 0;
    height: 0;
    transform: scale(1);
    background-color: #0052cc;
    border-radius: 50%;
    margin: auto;
    position: absolute;
    overflow: hidden;
    color: #fff;
    top: 50%;
    left: 50%; 
  }

  .mp-content {
    width: 100vw;
    height: 100vh; 
  }

  .mediaPickerDropzone {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 0;
    overflow: hidden;
    margin: auto;
    font-family: "Source Sans Pro", "Helvetica Neue", "Helvetica", Arial, sans-serif;
    pointer-events: none;
  }

  .mediaPickerDropzone.active {
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    position: fixed;
    z-index: 500;
  }

  .mediaPickerDropzone.active .mp-circle {
    width: 500px;
    height: 500px;
    top: calc(50% - 250px);
    left: calc(50% - 250px);
  }

  @keyframes atlassian-doc {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(-18deg); }
  }

  @keyframes spreadsheet {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(20deg); }
  }
`;

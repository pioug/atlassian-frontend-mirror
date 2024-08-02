# SVG Auditing Automation Tool Documentation

## Overview

This tool automates the process of identifying `svg` elements within React components or standalone
`.svg` files and captures screenshots of them under different themes (dark and light mode).
Additionally, it generates an HTML audit report documenting the occurrences and appearances of SVG
components across specified directories.

## Features

- **Component Discovery:** Finds React components or `.svg` files containing `svg` element.
- **Screenshot Capture:** Automated screenshot capture of `svg` components in two different themes.
- **Reporting:** Generates an HTML report detailing `svg` usage and their visual representation in
  the system.

## Requirements

- Node.js
- npm or yarn
- Puppeteer
- Globby for file pattern matching
- Babel for processing JSX and TypeScript files

## Installation

Before running the script, make sure all dependencies are installed:

```bash
npm install puppeteer globby @babel/register @babel/preset-env @babel/preset-react @babel/preset-typescript
```

## Usage

The script expects a directory path as a command-line argument which points to the location where
the React components or `.svg` files are stored.

```bash
# Ensure you are within the directory /platform/packages/design-system/icon/scripts before executing this command.

node svg-automation.js packages/<package-name>
```

## Functions Summary

### `findComponentsWithSVGs(dir)`

Searches through specified directories for React components (.jsx, .tsx) or `.svg` files that
contain `svg` tags. It ignores specified directories to prevent redundancy.

#### Parameters:

- `dir`: The directory to search within.

#### Returns:

Object containing two arrays:

- `components`: Paths to React components containing `svg`.
- `svgFiles`: Paths to standalone `.svg` files.

### `renderComponents(componentPath)`

Renders specified React components into static HTML.

#### Parameters:

- `componentPath`: Path to the React component file.

#### Returns:

String containing rendered HTML.

### `captureScreenshot(htmlContent, outputPath)`

Captures a screenshot of provided HTML content and saves it under specified output paths for both
themes.

#### Parameters:

- `htmlContent`: HTML string of content to capture.
- `outputPath`: Path where the screenshot should be saved.

### `captureAllScreenshots(options)`

Orchestrates screenshot capturing for an array of file paths, managing output paths and themes.

#### Parameters:

- `options`: Object containing files, packageName, result array, and a flag `hasSvgs`.

### `generateHTMLReport(components)`

Generates an HTML report summarizing the `svg` usage and their screenshots.

#### Parameters:

- `components`: Array of components that include file paths and optional screenshot paths.

#### Returns:

String of the complete HTML content for the report.

### `getPackageName(targetDir)`

Extracts the package name from a given directory path.

#### Parameters:

- `targetDir`: A directory path.

#### Returns:

A string representing the package name derived from the directory path.

### `createFolders(targetDir)`

Handles the creation of necessary directories for storing output files based on the provided target
directory.

#### Parameters:

- `targetDir`: A directory path used for deriving the package name and creating folder structures.

### Entry Point: `main()`

Serves as the entry point of the script, tying all functionalities together to produce the final
output—the `svg` audit report.

## Output

Generates an HTML file documenting all `svg` components found along with their screenshots in both
dark and light themes, saved in an output directory named after the package or directory processed.

---

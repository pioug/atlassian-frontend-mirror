//#region html snippets for tableNodes
export const ATTRIBUTES_PARSE_DEFAULTS = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table>
<tbody>
  <tr>
    <th class="pm-table-header-content-wrap">
      <p><strong>A</strong></p>
    </th>
    <td class="pm-table-cell-content-wrap">
      <p><strong>B</strong></p>
    </td>
  </tr>
  <tr>
    <th class="pm-table-header-content-wrap"><p>1</p></th>
    <td class="pm-table-cell-content-wrap"><p>2</p></td>
  </tr>
</tbody>
</table>`;
export const ATTRIBUTES_PARSE_NUMBERED_COLUMNS = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table
data-number-column="true"
data-layout="default"
data-autosize="false"
data-pm-slice="1 1 []"
>
<tbody>
  <tr>
    <th class="pm-table-header-content-wrap">
      <p><strong>A</strong></p>
    </th>
    <td class="pm-table-cell-content-wrap">
      <p><strong>B</strong></p>
    </td>
  </tr>
  <tr>
    <th class="pm-table-header-content-wrap"><p>1</p></th>
    <td class="pm-table-cell-content-wrap"><p>2</p></td>
  </tr>
</tbody>
</table>`;
export const ATTRIBUTES_PARSE_WIDE_LAYOUT = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table
data-number-column="false"
data-layout="wide"
data-autosize="false"
data-pm-slice="1 1 []"
>
<tbody>
  <tr>
    <td class="pm-table-cell-content-wrap">
      <p><strong>A</strong></p>
    </td>
    <td class="pm-table-cell-content-wrap">
      <p><strong>B</strong></p>
    </td>
  </tr>
  <tr>
    <td class="pm-table-cell-content-wrap"><p>1</p></td>
    <td class="pm-table-cell-content-wrap"><p>2</p></td>
  </tr>
</tbody>
</table>`;
export const ATTRIBUTES_PARSE_FULLWIDTH_LAYOUT = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table
data-number-column="false"
data-layout="full-width"
data-autosize="false"
data-pm-slice="1 1 []"
>
<tbody>
  <tr>
    <td class="pm-table-cell-content-wrap">
      <p><strong>A</strong></p>
    </td>
    <td class="pm-table-cell-content-wrap">
      <p><strong>B</strong></p>
    </td>
  </tr>
  <tr>
    <td class="pm-table-cell-content-wrap"><p>1</p></td>
    <td class="pm-table-cell-content-wrap"><p>2</p></td>
  </tr>
</tbody>
</table>`;
export const HTML_PARSE_EDITOR_2x2 = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table
  data-number-column="false"
  data-layout="default"
  data-autosize="false"
  data-pm-slice="1 1 []"
>
  <tbody>
    <tr>
      <th class="pm-table-header-content-wrap">
        <p><strong>A</strong></p>
      </th>
      <th class="pm-table-header-content-wrap">
        <p><strong>B</strong></p>
      </th>
    </tr>
    <tr>
      <td class="pm-table-cell-content-wrap"><p>1</p></td>
      <td class="pm-table-cell-content-wrap"><p>2</p></td>
    </tr>
  </tbody>
</table>`;
export const HTML_PARSE_EDITOR_2x2_WITH_HEADER_COLUMN = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table
  data-number-column="true"
  data-layout="default"
  data-autosize="false"
  data-pm-slice="1 1 []"
>
  <tbody>
    <tr>
      <th class="pm-table-header-content-wrap">
        <p><strong>A</strong></p>
      </th>
      <td class="pm-table-cell-content-wrap">
        <p><strong>B</strong></p>
      </td>
    </tr>
    <tr>
      <th class="pm-table-header-content-wrap"><p>1</p></th>
      <td class="pm-table-cell-content-wrap"><p>2</p></td>
    </tr>
  </tbody>
</table>`;
export const HTML_PARSE_EDITOR_2x1_ONLY_HEADERS = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table data-pm-slice="1 1 []">
  <tbody>
    <tr>
      <th class="pm-table-header-content-wrap">
        <p><strong>A</strong></p>
      </th>
      <th class="pm-table-header-content-wrap">
        <p><strong>B</strong></p>
      </th>
    </tr>
  </tbody>
</table>`;
export const HTML_PARSE_EDITOR_2x1_PARTIAL_CELL_SELECTION = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table data-pm-slice="1 1 []">
  <tbody>
    <tr>
      <td class="pm-table-cell-content-wrap"><p>1</p></td>
      <td class="pm-table-cell-content-wrap"><p>2</p></td>
    </tr>
  </tbody>
</table>`;
export const HTML_PARSE_EDITOR_1x2_PARTIAL_HEADER_CELL = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table data-pm-slice="1 1 []">
  <tbody>
    <tr>
      <th class="pm-table-header-content-wrap">
        <p><strong>B</strong></p>
      </th>
    </tr>
    <tr>
      <td class="pm-table-cell-content-wrap"><p>2</p></td>
    </tr>
  </tbody>
</table>`;
export const HTML_PARSE_EDITOR_P_TABLE_P_RANGE = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<p data-pm-slice="1 1 []">hello</p>
<table data-number-column="false" data-layout="default" data-autosize="false">
  <tbody>
    <tr>
      <th class="pm-table-header-content-wrap">
        <p><strong>A</strong></p>
      </th>
      <th class="pm-table-header-content-wrap">
        <p><strong>B</strong></p>
      </th>
    </tr>
    <tr>
      <td class="pm-table-cell-content-wrap"><p>1</p></td>
      <td class="pm-table-cell-content-wrap"><p>2</p></td>
    </tr>
  </tbody>
</table>
<p>there</p>`;
export const HTML_PARSE_EDITOR_P_PARTIAL_TABLE = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<p data-pm-slice="1 4 []">hello</p>
<table data-number-column="false" data-layout="full-width" data-autosize="false">
  <tbody>
    <tr>
      <th class="pm-table-header-content-wrap">
        <p><strong>A</strong></p>
      </th>
      <th class="pm-table-header-content-wrap">
        <p><strong>B</strong></p>
      </th>
    </tr>
    <tr>
      <td class="pm-table-cell-content-wrap"><p>1</p></td>
    </tr>
  </tbody>
</table>`;
export const HTML_PARSE_GOOGLE_SHEETS_DATA_CELLS = `<meta
  http-equiv="content-type"
  content="text/html; charset=utf-8"
/><google-sheets-html-origin
><style type="text/css">
  <!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}-->
</style>
<table
  xmlns="http://www.w3.org/1999/xhtml"
  cellspacing="0"
  cellpadding="0"
  dir="ltr"
  border="1"
  style="table-layout:fixed;font-size:10pt;font-family:Arial;width:0px;border-collapse:collapse;border:none"
>
  <colgroup>
    <col width="100" />
    <col width="100" />
  </colgroup>
  <tbody>
    <tr style="height:21px;">
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;"
      ></td>
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;font-weight:bold;"
        data-sheets-value='{"1":2,"2":"Team members"}'
      >
        Team members
      </td>
    </tr>
    <tr style="height:21px;">
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;"
        data-sheets-value='{"1":3,"3":1}'
      >
        1
      </td>
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;"
        data-sheets-value='{"1":2,"2":"Han"}'
      >
        Han
      </td>
    </tr>
    <tr style="height:21px;">
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;"
        data-sheets-value='{"1":3,"3":2}'
      >
        2
      </td>
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;"
        data-sheets-value='{"1":2,"2":"Kristina"}'
      >
        Kristina
      </td>
    </tr>
    <tr style="height:21px;">
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;"
        data-sheets-value='{"1":3,"3":3}'
      >
        3
      </td>
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;"
        data-sheets-value='{"1":2,"2":"Lucy"}'
      >
        Lucy
      </td>
    </tr>
    <tr style="height:21px;">
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;"
        data-sheets-value='{"1":3,"3":4}'
      >
        4
      </td>
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;"
        data-sheets-value='{"1":2,"2":"Mario"}'
      >
        Mario
      </td>
    </tr>
    <tr style="height:21px;">
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;"
        data-sheets-value='{"1":3,"3":5}'
      >
        5
      </td>
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;"
        data-sheets-value='{"1":2,"2":"Pavlo"}'
      >
        Pavlo
      </td>
    </tr>
    <tr style="height:21px;">
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;"
        data-sheets-value='{"1":3,"3":6}'
      >
        6
      </td>
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;"
        data-sheets-value='{"1":2,"2":"Sam"}'
      >
        Sam
      </td>
    </tr>
    <tr style="height:21px;">
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;"
        data-sheets-value='{"1":3,"3":7}'
      >
        7
      </td>
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;"
        data-sheets-value='{"1":2,"2":"Twig"}'
      >
        Twig
      </td>
    </tr>
    <tr style="height:21px;">
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;"
        data-sheets-value='{"1":3,"3":8}'
      >
        8
      </td>
      <td
        style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;"
        data-sheets-value='{"1":2,"2":"Wing"}'
      >
        Wing
      </td>
    </tr>
  </tbody>
</table></google-sheets-html-origin
>`;
export const HTML_PARSE_RENDERER_FULL_TABLE_2x2_NO_HEADERS = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table
  data-number-column="false"
  style='margin: 24px 0px 0px; border-collapse: collapse; width: 511px; border: 1px solid rgb(193, 199, 208); table-layout: fixed; font-size: 16px; color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;'
>
  <tbody style="border-bottom: none; box-sizing: border-box;">
    <tr style="box-sizing: border-box;">
      <td
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top; position: relative;"
      >
        <p
          data-renderer-start-pos="4"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          A
        </p>
      </td>
      <td
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top; position: relative;"
      >
        <p
          data-renderer-start-pos="9"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          B
        </p>
      </td>
    </tr>
    <tr style="box-sizing: border-box;">
      <td
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top;"
      >
        <p
          data-renderer-start-pos="16"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          C
        </p>
      </td>
      <td
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top;"
      >
        <p
          data-renderer-start-pos="21"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          D
        </p>
      </td>
    </tr>
  </tbody>
</table>`;
export const HTML_PARSE_RENDERER_FULL_TABLE_2x2_HEADER_COLUMN = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table
  data-number-column="false"
  style='margin: 24px 0px 0px; border-collapse: collapse; width: 511px; border: 1px solid rgb(193, 199, 208); table-layout: fixed; font-size: 16px; color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;'
>
  <tbody style="border-bottom: none; box-sizing: border-box;">
    <tr style="box-sizing: border-box;">
      <th
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247); position: relative;"
      >
        <p
          data-renderer-start-pos="4"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          A
        </p>
      </th>
      <td
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top; position: relative;"
      >
        <p
          data-renderer-start-pos="9"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          B
        </p>
      </td>
    </tr>
    <tr style="box-sizing: border-box;">
      <th
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247);"
      >
        <p
          data-renderer-start-pos="16"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          C
        </p>
      </th>
      <td
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top;"
      >
        <p
          data-renderer-start-pos="21"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          D
        </p>
      </td>
    </tr>
  </tbody>
</table>`;
export const HTML_PARSE_RENDERER_FULL_TABLE_2x2_HEADER_ROW = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table
  data-number-column="false"
  style='margin: 24px 0px 0px; border-collapse: collapse; width: 511px; border: 1px solid rgb(193, 199, 208); table-layout: fixed; font-size: 16px; color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;'
>
  <tbody style="border-bottom: none; box-sizing: border-box;">
    <tr style="box-sizing: border-box;">
      <th
        rowspan="1"
        colspan="1"
        colorname=""
        class="ak-renderer-tableHeader-sortable-column"
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247); cursor: pointer; position: relative;"
      >
        <p
          data-renderer-start-pos="4"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          A
        </p>
        <figure
          class="ak-renderer-tableHeader-sorting-icon ak-renderer-tableHeader-sorting-icon__no-order"
          style="display: block; box-sizing: border-box; margin: 0px; opacity: 0; transition: opacity 0.2s ease-in-out 0s;"
        >
          <div style="margin: 0px; padding: 0px; box-sizing: border-box;">
            <figure
              class="sc-iIHSe iLonrS"
              style="display: flex; position: absolute; height: 28px; width: 28px; margin: 6px; right: 0px; top: 0px; border: 2px solid rgb(255, 255, 255); border-radius: 4px; background-color: rgb(244, 245, 247); -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center; box-sizing: border-box;"
            >
              <div
                class="sorting-icon-svg__no_order table-sorting-icon-inactive sc-gldTML gAYeZB"
                style='margin: 0px; padding: 0px; width: 8px; height: 12px; transition: transform 0.3s cubic-bezier(0.15, 1, 0.3, 1) 0s; transform-origin: 50% 50%; background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M-8-6h24v24H-8z%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M3%208.509V1c0-.552.449-1%201-1%20.552%200%201%20.448%201%201V8.51l1.217-1.206a1.05%201.05%200%20011.477%200%201.03%201.03%200%2001.004%201.463l-.003.002-2.956%202.93a1.053%201.053%200%2001-1.478%200L.305%208.767a1.03%201.03%200%2001.001-1.464%201.05%201.05%200%20011.477%200L3%208.508z%22%20fill%3D%22%2342526E%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E"); opacity: 0.5; box-sizing: border-box;'
              ></div>
            </figure>
          </div>
        </figure>
      </th>
      <th
        rowspan="1"
        colspan="1"
        colorname=""
        class="ak-renderer-tableHeader-sortable-column"
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247); cursor: pointer; position: relative;"
      >
        <p
          data-renderer-start-pos="9"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          B
        </p>
        <figure
          class="ak-renderer-tableHeader-sorting-icon ak-renderer-tableHeader-sorting-icon__no-order"
          style="display: block; box-sizing: border-box; margin: 0px; opacity: 0; transition: opacity 0.2s ease-in-out 0s;"
        >
          <div style="margin: 0px; padding: 0px; box-sizing: border-box;">
            <figure
              class="sc-iIHSe iLonrS"
              style="display: flex; position: absolute; height: 28px; width: 28px; margin: 6px; right: 0px; top: 0px; border: 2px solid rgb(255, 255, 255); border-radius: 4px; background-color: rgb(244, 245, 247); -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center; box-sizing: border-box;"
            >
              <div
                class="sorting-icon-svg__no_order table-sorting-icon-inactive sc-gldTML gAYeZB"
                style='margin: 0px; padding: 0px; width: 8px; height: 12px; transition: transform 0.3s cubic-bezier(0.15, 1, 0.3, 1) 0s; transform-origin: 50% 50%; background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M-8-6h24v24H-8z%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M3%208.509V1c0-.552.449-1%201-1%20.552%200%201%20.448%201%201V8.51l1.217-1.206a1.05%201.05%200%20011.477%200%201.03%201.03%200%2001.004%201.463l-.003.002-2.956%202.93a1.053%201.053%200%2001-1.478%200L.305%208.767a1.03%201.03%200%2001.001-1.464%201.05%201.05%200%20011.477%200L3%208.508z%22%20fill%3D%22%2342526E%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E"); opacity: 0.5; box-sizing: border-box;'
              ></div>
            </figure>
          </div>
        </figure>
      </th>
    </tr>
    <tr style="box-sizing: border-box;">
      <td
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top;"
      >
        <p
          data-renderer-start-pos="16"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          C
        </p>
      </td>
      <td
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top;"
      >
        <p
          data-renderer-start-pos="21"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          D
        </p>
      </td>
    </tr>
  </tbody>
</table>`;
export const HTML_PARSE_RENDERER_FULL_2x1_TABLE_ONLY_HEADERS = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table
  data-number-column="false"
  style='margin: 24px 0px 0px; border-collapse: collapse; width: 511px; border: 1px solid rgb(193, 199, 208); table-layout: fixed; font-size: 16px; color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;'
>
  <tbody style="border-bottom: none; box-sizing: border-box;">
    <tr style="box-sizing: border-box;">
      <th
        rowspan="1"
        colspan="1"
        colorname=""
        class="ak-renderer-tableHeader-sortable-column"
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247); cursor: pointer; position: relative;"
      >
        <p
          data-renderer-start-pos="4"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          A
        </p>
        <figure
          class="ak-renderer-tableHeader-sorting-icon ak-renderer-tableHeader-sorting-icon__no-order"
          style="display: block; box-sizing: border-box; margin: 0px; opacity: 0; transition: opacity 0.2s ease-in-out 0s;"
        >
          <div style="margin: 0px; padding: 0px; box-sizing: border-box;">
            <figure
              class="sc-iIHSe iLonrS"
              style="display: flex; position: absolute; height: 28px; width: 28px; margin: 6px; right: 0px; top: 0px; border: 2px solid rgb(255, 255, 255); border-radius: 4px; background-color: rgb(244, 245, 247); -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center; box-sizing: border-box;"
            >
              <div
                class="sorting-icon-svg__no_order table-sorting-icon-inactive sc-gldTML gAYeZB"
                style='margin: 0px; padding: 0px; width: 8px; height: 12px; transition: transform 0.3s cubic-bezier(0.15, 1, 0.3, 1) 0s; transform-origin: 50% 50%; background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M-8-6h24v24H-8z%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M3%208.509V1c0-.552.449-1%201-1%20.552%200%201%20.448%201%201V8.51l1.217-1.206a1.05%201.05%200%20011.477%200%201.03%201.03%200%2001.004%201.463l-.003.002-2.956%202.93a1.053%201.053%200%2001-1.478%200L.305%208.767a1.03%201.03%200%2001.001-1.464%201.05%201.05%200%20011.477%200L3%208.508z%22%20fill%3D%22%2342526E%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E"); opacity: 0.5; box-sizing: border-box;'
              ></div>
            </figure>
          </div>
        </figure>
      </th>
      <th
        rowspan="1"
        colspan="1"
        colorname=""
        class="ak-renderer-tableHeader-sortable-column"
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247); cursor: pointer; position: relative;"
      >
        <p
          data-renderer-start-pos="9"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          B
        </p>
        <figure
          class="ak-renderer-tableHeader-sorting-icon ak-renderer-tableHeader-sorting-icon__no-order"
          style="display: block; box-sizing: border-box; margin: 0px; opacity: 0; transition: opacity 0.2s ease-in-out 0s;"
        >
          <div style="margin: 0px; padding: 0px; box-sizing: border-box;">
            <figure
              class="sc-iIHSe iLonrS"
              style="display: flex; position: absolute; height: 28px; width: 28px; margin: 6px; right: 0px; top: 0px; border: 2px solid rgb(255, 255, 255); border-radius: 4px; background-color: rgb(244, 245, 247); -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center; box-sizing: border-box;"
            >
              <div
                class="sorting-icon-svg__no_order table-sorting-icon-inactive sc-gldTML gAYeZB"
                style='margin: 0px; padding: 0px; width: 8px; height: 12px; transition: transform 0.3s cubic-bezier(0.15, 1, 0.3, 1) 0s; transform-origin: 50% 50%; background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M-8-6h24v24H-8z%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M3%208.509V1c0-.552.449-1%201-1%20.552%200%201%20.448%201%201V8.51l1.217-1.206a1.05%201.05%200%20011.477%200%201.03%201.03%200%2001.004%201.463l-.003.002-2.956%202.93a1.053%201.053%200%2001-1.478%200L.305%208.767a1.03%201.03%200%2001.001-1.464%201.05%201.05%200%20011.477%200L3%208.508z%22%20fill%3D%22%2342526E%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E"); opacity: 0.5; box-sizing: border-box;'
              ></div>
            </figure>
          </div>
        </figure>
      </th>
    </tr>
    <tr style="box-sizing: border-box;">
      <th
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247);"
      >
        <p
          data-renderer-start-pos="16"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          C
        </p>
      </th>
      <th
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247);"
      >
        <p
          data-renderer-start-pos="21"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          D
        </p>
      </th>
    </tr>
  </tbody>
</table>`;
export const HTML_PARSE_RENDERER_PARTIAL_TABLE_2x1_CELL_SELECTION = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table
  data-number-column="false"
  style='margin: 24px 0px 0px; border-collapse: collapse; width: 511px; border: 1px solid rgb(193, 199, 208); table-layout: fixed; font-size: 16px; color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;'
>
  <tbody style="border-bottom: none; box-sizing: border-box;">
    <tr style="box-sizing: border-box;">
      <td
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top; position: relative;"
      >
        <p
          data-renderer-start-pos="4"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          A
        </p>
      </td>
      <td
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top; position: relative;"
      >
        <p
          data-renderer-start-pos="9"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          B
        </p>
      </td>
    </tr>
  </tbody>
</table>`;
export const HTML_PARSE_RENDERER_PARTIAL_TABLE_2x1_HEADER_CELL_SELECTION = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<table
  data-number-column="false"
  style='margin: 24px 0px 0px; border-collapse: collapse; width: 511px; border: 1px solid rgb(193, 199, 208); table-layout: fixed; font-size: 16px; color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;'
>
  <tbody style="border-bottom: none; box-sizing: border-box;">
    <tr style="box-sizing: border-box;">
      <th
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247); position: relative;"
      >
        <p
          data-renderer-start-pos="4"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          A
        </p>
      </th>
      <td
        rowspan="1"
        colspan="1"
        colorname=""
        style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top; position: relative;"
      >
        <p
          data-renderer-start-pos="9"
          style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
        >
          B
        </p>
      </td>
    </tr>
  </tbody>
</table>`;
export const HTML_PARSE_RENDERER_P_TABLE_P_SELECTION_RANGE = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<p
  data-renderer-start-pos="1"
  style='margin: 0px; padding: 0px; font-size: 16px; line-height: 1.714; font-weight: 400; letter-spacing: -0.005em; color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;'
>
  before
</p>
<div
  class="pm-table-container  sc-jKmXuR GaTQv"
  data-layout="default"
  style='margin: 0px auto 16px; padding: 0px; position: relative; box-sizing: border-box; z-index: 0; transition: all 0.1s linear 0s; display: flex; clear: both; color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; width: inherit;'
>
  <div
    class="pm-table-wrapper"
    style="margin: 0px; padding: 0px; overflow-x: auto;"
  >
    <table
      data-number-column="false"
      style="margin: 24px 0px 0px; border-collapse: collapse; width: 511px; border: 1px solid rgb(193, 199, 208); table-layout: fixed; font-size: 1em;"
    >
      <tbody style="border-bottom: none; box-sizing: border-box;">
        <tr style="box-sizing: border-box;">
          <th
            rowspan="1"
            colspan="1"
            colorname=""
            class="ak-renderer-tableHeader-sortable-column"
            style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247); cursor: pointer; position: relative;"
          >
            <p
              data-renderer-start-pos="12"
              style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
            >
              A
            </p>
            <figure
              class="ak-renderer-tableHeader-sorting-icon ak-renderer-tableHeader-sorting-icon__no-order"
              style="display: block; box-sizing: border-box; margin: 0px; opacity: 0; transition: opacity 0.2s ease-in-out 0s;"
            >
              <div style="margin: 0px; padding: 0px; box-sizing: border-box;">
                <figure
                  class="sc-iIHSe iLonrS"
                  style="display: flex; position: absolute; height: 28px; width: 28px; margin: 6px; right: 0px; top: 0px; border: 2px solid rgb(255, 255, 255); border-radius: 4px; background-color: rgb(244, 245, 247); -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center; box-sizing: border-box;"
                >
                  <div
                    class="sorting-icon-svg__no_order table-sorting-icon-inactive sc-gldTML gAYeZB"
                    style='margin: 0px; padding: 0px; width: 8px; height: 12px; transition: transform 0.3s cubic-bezier(0.15, 1, 0.3, 1) 0s; transform-origin: 50% 50%; background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M-8-6h24v24H-8z%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M3%208.509V1c0-.552.449-1%201-1%20.552%200%201%20.448%201%201V8.51l1.217-1.206a1.05%201.05%200%20011.477%200%201.03%201.03%200%2001.004%201.463l-.003.002-2.956%202.93a1.053%201.053%200%2001-1.478%200L.305%208.767a1.03%201.03%200%2001.001-1.464%201.05%201.05%200%20011.477%200L3%208.508z%22%20fill%3D%22%2342526E%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E"); opacity: 0.5; box-sizing: border-box;'
                  ></div>
                </figure>
              </div>
            </figure>
          </th>
          <th
            rowspan="1"
            colspan="1"
            colorname=""
            class="ak-renderer-tableHeader-sortable-column"
            style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247); cursor: pointer; position: relative;"
          >
            <p
              data-renderer-start-pos="17"
              style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
            >
              B
            </p>
            <figure
              class="ak-renderer-tableHeader-sorting-icon ak-renderer-tableHeader-sorting-icon__no-order"
              style="display: block; box-sizing: border-box; margin: 0px; opacity: 0; transition: opacity 0.2s ease-in-out 0s;"
            >
              <div style="margin: 0px; padding: 0px; box-sizing: border-box;">
                <figure
                  class="sc-iIHSe iLonrS"
                  style="display: flex; position: absolute; height: 28px; width: 28px; margin: 6px; right: 0px; top: 0px; border: 2px solid rgb(255, 255, 255); border-radius: 4px; background-color: rgb(244, 245, 247); -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center; box-sizing: border-box;"
                >
                  <div
                    class="sorting-icon-svg__no_order table-sorting-icon-inactive sc-gldTML gAYeZB"
                    style='margin: 0px; padding: 0px; width: 8px; height: 12px; transition: transform 0.3s cubic-bezier(0.15, 1, 0.3, 1) 0s; transform-origin: 50% 50%; background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M-8-6h24v24H-8z%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M3%208.509V1c0-.552.449-1%201-1%20.552%200%201%20.448%201%201V8.51l1.217-1.206a1.05%201.05%200%20011.477%200%201.03%201.03%200%2001.004%201.463l-.003.002-2.956%202.93a1.053%201.053%200%2001-1.478%200L.305%208.767a1.03%201.03%200%2001.001-1.464%201.05%201.05%200%20011.477%200L3%208.508z%22%20fill%3D%22%2342526E%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E"); opacity: 0.5; box-sizing: border-box;'
                  ></div>
                </figure>
              </div>
            </figure>
          </th>
        </tr>
        <tr style="box-sizing: border-box;">
          <td
            rowspan="1"
            colspan="1"
            colorname=""
            style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top;"
          >
            <p
              data-renderer-start-pos="24"
              style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
            >
              C
            </p>
          </td>
          <td
            rowspan="1"
            colspan="1"
            colorname=""
            style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top;"
          >
            <p
              data-renderer-start-pos="29"
              style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
            >
              D
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<p
  data-renderer-start-pos="35"
  style='margin: 0.75rem 0px 0px; padding: 0px; font-size: 16px; line-height: 1.714; font-weight: 400; letter-spacing: -0.005em; color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;'
>
  after
</p>`;
export const HTML_PARSE_RENDERER_P_PARTIAL_TABLE_SELECTION_RANGE = `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<p
  data-renderer-start-pos="1"
  style='margin: 0px; padding: 0px; font-size: 16px; line-height: 1.714; font-weight: 400; letter-spacing: -0.005em; color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;'
>
  before
</p>
<div
  class="pm-table-container  sc-jKmXuR GaTQv"
  data-layout="default"
  style='margin: 0px auto 16px; padding: 0px; position: relative; box-sizing: border-box; z-index: 0; transition: all 0.1s linear 0s; display: flex; clear: both; color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; width: inherit;'
>
  <div
    class="pm-table-wrapper"
    style="margin: 0px; padding: 0px; overflow-x: auto;"
  >
    <table
      data-number-column="false"
      style="margin: 24px 0px 0px; border-collapse: collapse; width: 511px; border: 1px solid rgb(193, 199, 208); table-layout: fixed; font-size: 1em;"
    >
      <tbody style="border-bottom: none; box-sizing: border-box;">
        <tr style="box-sizing: border-box;">
          <th
            rowspan="1"
            colspan="1"
            colorname=""
            class="ak-renderer-tableHeader-sortable-column"
            style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247); cursor: pointer; position: relative;"
          >
            <p
              data-renderer-start-pos="12"
              style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
            >
              A
            </p>
            <figure
              class="ak-renderer-tableHeader-sorting-icon ak-renderer-tableHeader-sorting-icon__no-order"
              style="display: block; box-sizing: border-box; margin: 0px; opacity: 0; transition: opacity 0.2s ease-in-out 0s;"
            >
              <div style="margin: 0px; padding: 0px; box-sizing: border-box;">
                <figure
                  class="sc-iIHSe iLonrS"
                  style="display: flex; position: absolute; height: 28px; width: 28px; margin: 6px; right: 0px; top: 0px; border: 2px solid rgb(255, 255, 255); border-radius: 4px; background-color: rgb(244, 245, 247); -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center; box-sizing: border-box;"
                >
                  <div
                    class="sorting-icon-svg__no_order table-sorting-icon-inactive sc-gldTML gAYeZB"
                    style='margin: 0px; padding: 0px; width: 8px; height: 12px; transition: transform 0.3s cubic-bezier(0.15, 1, 0.3, 1) 0s; transform-origin: 50% 50%; background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M-8-6h24v24H-8z%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M3%208.509V1c0-.552.449-1%201-1%20.552%200%201%20.448%201%201V8.51l1.217-1.206a1.05%201.05%200%20011.477%200%201.03%201.03%200%2001.004%201.463l-.003.002-2.956%202.93a1.053%201.053%200%2001-1.478%200L.305%208.767a1.03%201.03%200%2001.001-1.464%201.05%201.05%200%20011.477%200L3%208.508z%22%20fill%3D%22%2342526E%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E"); opacity: 0.5; box-sizing: border-box;'
                  ></div>
                </figure>
              </div>
            </figure>
          </th>
          <th
            rowspan="1"
            colspan="1"
            colorname=""
            class="ak-renderer-tableHeader-sortable-column"
            style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; font-weight: normal; background-color: rgb(244, 245, 247); cursor: pointer; position: relative;"
          >
            <p
              data-renderer-start-pos="17"
              style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
            >
              B
            </p>
            <figure
              class="ak-renderer-tableHeader-sorting-icon ak-renderer-tableHeader-sorting-icon__no-order"
              style="display: block; box-sizing: border-box; margin: 0px; opacity: 0; transition: opacity 0.2s ease-in-out 0s;"
            >
              <div style="margin: 0px; padding: 0px; box-sizing: border-box;">
                <figure
                  class="sc-iIHSe iLonrS"
                  style="display: flex; position: absolute; height: 28px; width: 28px; margin: 6px; right: 0px; top: 0px; border: 2px solid rgb(255, 255, 255); border-radius: 4px; background-color: rgb(244, 245, 247); -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center; box-sizing: border-box;"
                >
                  <div
                    class="sorting-icon-svg__no_order table-sorting-icon-inactive sc-gldTML gAYeZB"
                    style='margin: 0px; padding: 0px; width: 8px; height: 12px; transition: transform 0.3s cubic-bezier(0.15, 1, 0.3, 1) 0s; transform-origin: 50% 50%; background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M-8-6h24v24H-8z%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M3%208.509V1c0-.552.449-1%201-1%20.552%200%201%20.448%201%201V8.51l1.217-1.206a1.05%201.05%200%20011.477%200%201.03%201.03%200%2001.004%201.463l-.003.002-2.956%202.93a1.053%201.053%200%2001-1.478%200L.305%208.767a1.03%201.03%200%2001.001-1.464%201.05%201.05%200%20011.477%200L3%208.508z%22%20fill%3D%22%2342526E%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E"); opacity: 0.5; box-sizing: border-box;'
                  ></div>
                </figure>
              </div>
            </figure>
          </th>
        </tr>
        <tr style="box-sizing: border-box;">
          <td
            rowspan="1"
            colspan="1"
            colorname=""
            style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top;"
          >
            <p
              data-renderer-start-pos="24"
              style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;"
            >
              C
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`;

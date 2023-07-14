import React from 'react';

const CSSResetComplexTablesExample = () => {
  return (
    <div>
      <table>
        <caption>Table captions are like headings for tabular data</caption>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>Total</th>
            <td>21</td>
            <td>$13.81</td>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <td>Apple</td>
            <td>3</td>
            <td>$5.42</td>
          </tr>
          <tr>
            <td>Orange</td>
            <td>6</td>
            <td>$4.60</td>
          </tr>
          <tr>
            <td>Banana</td>
            <td>12</td>
            <td>$3.79</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CSSResetComplexTablesExample;

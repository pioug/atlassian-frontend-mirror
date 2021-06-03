import React, { Fragment } from 'react';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

export default () => (
  <Fragment>
    <Warning />
    <form onSubmit={(e) => e.preventDefault()}>
      <h2>Favourite things</h2>
      <div className="ak-field-group">
        <label htmlFor="fav-fruit">Favourite fruit</label>
        <select
          className="ak-field-select"
          id="fav-fruit"
          name="fav-fruit"
          defaultValue="Cherry"
        >
          <optgroup label="Standard">
            <option>Apple</option>
            <option>Banana</option>
            <option>Cherry</option>
            <option>Orange</option>
            <option>Pear</option>
            <option>Strawberry</option>
            <option>Watermelon</option>
          </optgroup>
          <optgroup label="Exotic">
            <option>Durian</option>
            <option>Longan</option>
            <option>Lychee</option>
            <option>Paw paw</option>
            <option>Persimmon</option>
          </optgroup>
        </select>
      </div>
      <div className="ak-field-group">
        <label htmlFor="fav-fruit-multiple">
          Favourite fruit (multi select)
        </label>
        <select
          className="ak-field-select"
          multiple
          defaultValue={['Cherry', 'Apple', 'Paw paw']}
          id="fav-fruit-multiple"
          name="fav-fruit-multiple"
        >
          <optgroup label="Standard">
            <option>Apple</option>
            <option>Banana</option>
            <option>Cherry</option>
            <option>Orange</option>
            <option>Pear</option>
            <option>Strawberry</option>
            <option>Watermelon</option>
          </optgroup>
          <optgroup label="Exotic">
            <option>Durian</option>
            <option>Longan</option>
            <option>Lychee</option>
            <option>Paw paw</option>
            <option>Persimmon</option>
          </optgroup>
        </select>
      </div>
      <div className="ak-field-group">
        <label htmlFor="fav-movie">Favourite movie</label>
        <select
          className="ak-field-select"
          id="fav-movie"
          name="fav-movie"
          defaultValue="Star Wars"
          disabled
        >
          <optgroup label="Sci-fi">
            <option>Star Wars</option>
            <option>Star Trek</option>
          </optgroup>
          <optgroup label="Adventure">
            <option>Indiana Jones</option>
            <option>Tomb Raider</option>
          </optgroup>
        </select>
      </div>
      <div className="ak-field-group">
        <label htmlFor="fav-movies">Favourite movies (multi select)</label>
        <select
          className="ak-field-select"
          multiple
          defaultValue={['Star Wars', 'Indiana Jones']}
          id="fav-movies"
          name="fav-movies"
          disabled
        >
          <optgroup label="Sci-fi">
            <option>Star Wars</option>
            <option>Star Trek</option>
          </optgroup>
          <optgroup label="Adventure">
            <option>Indiana Jones</option>
            <option>Tomb Raider</option>
          </optgroup>
        </select>
      </div>
      <div className="ak-field-group">
        <button className="ak-button ak-button__appearance-primary">
          Save
        </button>
      </div>
    </form>
  </Fragment>
);

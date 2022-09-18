import '../css/styles.css';
var debounce = require('lodash.debounce');
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  div: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputContry, DEBOUNCE_DELAY));

function onInputContry(e) {
  const countryName = e.target.value.trim();

  if (!countryName) {
    refs.list.innerHTML = '';
    refs.div.innerHTML = '';
    return;
  }

  return fetchCountries(countryName)
  .then(country => renderCountryList(country))
  .catch(error => Notify.failure("Oops, there is no country with that name"));
};

function renderCountryList(country) {
  if (country.length > 10) {
    Notify.info("Too many matches found. Please enter a more specific name.");
  } else if(country.length > 1) {
    refs.div.innerHTML = '';

    const markup = country.map(state => {
      return `<li>
      <img src='${state.flags.svg}'>
      <p>${state.name.official}</p>
      </li>`;
    }).join('');

    refs.list.innerHTML = markup;
  } else if(country.length === 1) {
    refs.list.innerHTML = '';

    const markup = country.map(state => {
      return `<div><img src='${state.flags.svg}'>
      <h1>${state.name.official}</h1></div>
      <ul>
      <li><h3>Capital:</h3>${state.capital}</li>
      <li><h3>Population:</h3>${state.population}</li>
      <li><h3>Languages:</h3>${Object.values(state.languages)}</li>
      </ul>
      `;
    }).join('');

    refs.div.innerHTML = markup;
  }
};
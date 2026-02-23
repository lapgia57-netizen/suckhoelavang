// healthLib.js - A JavaScript library for fetching health data from reputable sources
// For use on bo0tot.org or any domain. This library uses public APIs from WHO and openFDA.
// No API keys required. Data is fetched asynchronously using fetch API.
// Ensure to handle CORS if needed on your server.

// Base URLs
const WHO_BASE_URL = 'https://ghoapi.azureedge.net/api';
const OPENFDA_BASE_URL = 'https://api.fda.gov';

/**
 * Fetches a list of health indicators from WHO GHO API.
 * @param {string} searchTerm - Term to search in indicator names (optional).
 * @returns {Promise<Object>} - JSON response with indicators.
 */
export async function getWHOIndicators(searchTerm = '') {
  let url = `${WHO_BASE_URL}/Indicator`;
  if (searchTerm) {
    url += `?$filter=contains(IndicatorName,'${encodeURIComponent(searchTerm)}')`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Fetches data for a specific WHO indicator.
 * @param {string} indicatorCode - The code of the indicator (e.g., 'WHOSIS_000001' for life expectancy).
 * @param {Object} filters - Optional filters like { Dim1: 'MLE', year: 2020 }.
 * @returns {Promise<Object>} - JSON response with data points.
 */
export async function getWHOIndicatorData(indicatorCode, filters = {}) {
  let url = `${WHO_BASE_URL}/${indicatorCode}`;
  const filterParts = [];
  if (filters.Dim1) {
    filterParts.push(`Dim1 eq '${filters.Dim1}'`);
  }
  if (filters.year) {
    filterParts.push(`TimeDim eq ${filters.year}`);
  }
  // Add more filters as needed, e.g., country: DimType eq 'COUNTRY' and Dim1 eq 'USA'
  if (filterParts.length > 0) {
    url += `?$filter=${filterParts.join(' and ')}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Searches for drug labels from openFDA.
 * @param {string} drugName - Name of the drug to search.
 * @param {number} limit - Number of results to return (default 10).
 * @returns {Promise<Object>} - JSON response with drug information.
 */
export async function searchDrugs(drugName, limit = 10) {
  const url = `${OPENFDA_BASE_URL}/drug/label.json?search=openfda.brand_name:${encodeURIComponent(drugName)}&limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Searches for food enforcement reports from openFDA.
 * @param {string} searchTerm - Term to search in reports.
 * @param {number} limit - Number of results to return (default 10).
 * @returns {Promise<Object>} - JSON response with enforcement data.
 */
export async function searchFoodEnforcement(searchTerm, limit = 10) {
  const url = `${OPENFDA_BASE_URL}/food/enforcement.json?search=${encodeURIComponent(searchTerm)}&limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Example usage:
// import { getWHOIndicators, searchDrugs } from './healthLib.js';
// getWHOIndicators('life expectancy').then(data => console.log(data));
// searchDrugs('aspirin').then(data => console.log(data));

// Note: For CDC WONDER, integration requires POST with XML, which is more complex.
// If needed, extend the library with XML-based requests using libraries like xml2js.
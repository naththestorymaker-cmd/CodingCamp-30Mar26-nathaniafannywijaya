# Implementation Plan: Expense Tracker (Vanilla Web App)

## Overview

Implement the Expense Tracker as three files: `index.html`, `css/style.css`, and `js/app.js`. No build step, no framework. Each task builds incrementally toward a fully wired, working app.

## Tasks

- [x] 1. Create the HTML skeleton (`index.html`)
  - Add `<!DOCTYPE html>` page with `<head>` linking `css/style.css` and Chart.js CDN
  - Add `#storage-warning` dismissible banner (hidden by default)
  - Add `#expense-form` with `#item-name`, `#amount`, `#category` select (Food/Transport/Fun), submit button, and `#form-error` element
  - Add `#balance` span in a balance display section
  - Add `#transaction-list` as a `<ul>` with fixed `max-height` and `overflow-y: auto`
  - Add `<canvas id="expense-chart">` and `#chart-placeholder` sibling element
  - Add `<script src="js/app.js">` at bottom of `<body>`
  - _Requirements: 1.1, 2.2, 3.1, 4.4, 6.1, 6.2, 6.5_

- [x] 2. Add base styles (`css/style.css`)
  - Style the form, inputs, and submit button
  - Style `#transaction-list` with `max-height` and `overflow-y: auto` for scrollability
  - Style each `<li>` to show name, amount, category badge, and delete button in a row
  - Style `#balance`, `#form-error`, `#storage-warning`, and `#chart-placeholder`
  - _Requirements: 2.2, 6.2_

- [x] 3. Implement state, storage, and initialization (`js/app.js`)
  - [x] 3.1 Define `state` object (`{ transactions: [], chart: null }`) and Transaction data shape
    - _Requirements: 5.1, 5.2_
  - [x] 3.2 Implement `saveToStorage(transactions)` and `loadFromStorage()` with try/catch
    - `loadFromStorage` must catch JSON parse errors and show `#storage-warning`
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ]* 3.3 Write property test for storage round-trip (Property 8)
    - **Property 8: Load from storage round-trip**
    - **Validates: Requirements 2.4, 5.2**
  - [ ]* 3.4 Write unit test for corrupt localStorage triggering warning (Property 10 edge case)
    - **Validates: Requirements 5.3**
  - [x] 3.5 Wire `DOMContentLoaded`: call `loadFromStorage()`, populate `state.transactions`, call `renderAll()`
    - _Requirements: 2.4, 5.2_

- [x] 4. Implement `renderAll()` — list, balance, and chart
  - [x] 4.1 Implement `renderList()`: clear `#transaction-list`, append one `<li>` per transaction showing name, amount, category badge, and a delete button wired to `deleteTransaction(id)`
    - _Requirements: 2.1, 2.3_
  - [ ]* 4.2 Write property test for list rendering all transactions (Property 4)
    - **Property 4: List renders all transactions**
    - **Validates: Requirements 2.1**
  - [x] 4.3 Implement `renderBalance()`: compute sum of all amounts and update `#balance` text
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 4.4 Write property test for balance equals sum of amounts (Property 6)
    - **Property 6: Balance equals sum of all amounts**
    - **Validates: Requirements 3.1, 3.2, 3.3**
  - [x] 4.5 Implement `renderChart()`: aggregate amounts by category; if no transactions destroy chart and show `#chart-placeholder`; otherwise create/update Chart.js pie chart with colors `#FF6384`, `#36A2EB`, `#FFCE56`; guard against missing `window.Chart`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 6.5_
  - [ ]* 4.6 Write property test for chart data matching category aggregation (Property 7)
    - **Property 7: Chart data matches category aggregation**
    - **Validates: Requirements 4.1, 4.2, 4.3**
  - [x] 4.7 Implement `renderAll()` to call `renderList()`, `renderBalance()`, and `renderChart()` in sequence
    - _Requirements: 3.2, 3.3, 4.2, 4.3_

- [x] 5. Checkpoint — verify rendering works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement `addTransaction` and form handling
  - [x] 6.1 Implement `addTransaction(tx)`: push to `state.transactions`, call `saveToStorage`, call `renderAll()`
    - _Requirements: 1.2, 5.1_
  - [ ]* 6.2 Write property test for valid transaction add round-trip (Property 1)
    - **Property 1: Valid transaction add round-trip**
    - **Validates: Requirements 1.2, 5.1**
  - [x] 6.3 Implement form submit handler: read field values, validate (non-empty name, positive numeric amount, category selected), show `#form-error` on failure, call `addTransaction` and clear form on success
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [ ]* 6.4 Write property test for invalid input rejection (Property 2)
    - **Property 2: Invalid input is rejected**
    - **Validates: Requirements 1.3, 1.4**
  - [ ]* 6.5 Write property test for form cleared after successful add (Property 3)
    - **Property 3: Form is cleared after successful add**
    - **Validates: Requirements 1.5**

- [x] 7. Implement `deleteTransaction`
  - [x] 7.1 Implement `deleteTransaction(id)`: filter `state.transactions` by id, call `saveToStorage`, call `renderAll()`
    - _Requirements: 2.3, 5.1_
  - [ ]* 7.2 Write property test for delete removes transaction from list and storage (Property 5)
    - **Property 5: Delete removes transaction from list and storage**
    - **Validates: Requirements 2.3, 5.1**

- [x] 8. Final checkpoint — full integration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement Dark/Light Mode Toggle
  - [x] 9.1 Add theme toggle button to `index.html` header and CSS variables for light/dark themes to `css/style.css`
    - Add `<button id="theme-toggle">` in a `<header>` element above `<main>`
    - Define `--bg`, `--surface`, `--text`, and related CSS custom properties under `[data-theme="light"]` and `[data-theme="dark"]` selectors in `style.css`
    - Update all color values in `style.css` to reference these variables
    - _Requirements: 7.1_
  - [x] 9.2 Implement theme initialization and toggle handler in `js/app.js`
    - On `DOMContentLoaded`: read `localStorage.getItem("theme")`, default to `"light"`, set `document.body.dataset.theme`
    - Wire `#theme-toggle` click: flip `data-theme` between `"light"` and `"dark"`, persist to `localStorage`, update button label
    - _Requirements: 7.2, 7.3, 7.4, 7.5_
  - [ ]* 9.3 Write property test for theme toggle (Property 11)
    - **Property 11: Theme toggle applies data-theme attribute**
    - **Validates: Requirements 7.1, 7.2**
  - [ ]* 9.4 Write property test for theme persistence round-trip (Property 12)
    - **Property 12: Theme persistence round-trip**
    - **Validates: Requirements 7.3, 7.4**

- [x] 10. Implement Monthly Summary Review
  - [x] 10.1 Add `#monthly-summary` section to `index.html` below the chart section
    - Add `<section id="monthly-summary" aria-label="Monthly spending summary">` with a heading
    - _Requirements: 8.1_
  - [x] 10.2 Implement `renderMonthlySummary()` in `js/app.js`
    - Group transactions by `"YYYY-MM"` from `tx.date`; fall back to `new Date(parseInt(tx.id)).toISOString()` for legacy transactions without a `date` field
    - Render month label (e.g. "July 2025"), total spent, and per-category breakdown (Food / Transport / Fun) for each group
    - Show empty-state message when no transactions exist
    - _Requirements: 8.1, 8.2, 8.3, 8.6_
  - [x] 10.3 Call `renderMonthlySummary()` inside `renderAll()` and add `date` field to new transactions
    - Append `renderMonthlySummary()` call at the end of `renderAll()`
    - Update the form submit handler in `addTransaction` call to include `date: new Date().toISOString()` on the transaction object
    - _Requirements: 8.4, 8.5_
  - [ ]* 10.4 Write property test for monthly summary grouping (Property 13)
    - **Property 13: Monthly summary groups match transaction months**
    - **Validates: Requirements 8.1, 8.2, 8.3**
  - [ ]* 10.5 Write property test for monthly totals correctness (Property 14)
    - **Property 14: Monthly totals are correct**
    - **Validates: Requirements 8.2, 8.3**

- [x] 11. Implement Sort Transactions
  - [x] 11.1 Add sort-select dropdown to `index.html` above `#transaction-list`
    - Add `<div class="sort-controls">` with `<select id="sort-select">` containing options: Default, Amount Low→High, Amount High→Low, Category A→Z
    - _Requirements: 9.1_
  - [x] 11.2 Add `sortOrder` to state and update `renderList()` to sort a copy before rendering
    - Add `sortOrder: "default"` to the `state` object in `js/app.js`
    - In `renderList()`, derive a sorted copy of `state.transactions` based on `state.sortOrder` before building the DOM — never mutate `state.transactions`
    - _Requirements: 9.2, 9.3, 9.5_
  - [x] 11.3 Wire `#sort-select` change event to update `state.sortOrder` and call `renderAll()`
    - Add event listener on `DOMContentLoaded` for `#sort-select` `change` event
    - _Requirements: 9.2, 9.4_
  - [ ]* 11.4 Write property test for sort order correctness (Property 15)
    - **Property 15: Sort renders list in correct order**
    - **Validates: Requirements 9.1, 9.2, 9.5**
  - [ ]* 11.5 Write property test for sort does not mutate storage (Property 16)
    - **Property 16: Sort does not mutate storage**
    - **Validates: Requirements 9.3**

- [x] 12. Final checkpoint — verify all three new features work end-to-end
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use **fast-check** (loaded via CDN or npm in the test environment) with a minimum of 100 iterations each
- Each property test must include a comment: `// Feature: vanilla-web-app, Property N: <property text>`
- All logic lives in `js/app.js` with no modules or bundler

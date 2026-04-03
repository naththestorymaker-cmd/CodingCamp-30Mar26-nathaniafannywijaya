# Requirements Document

## Introduction

The Expense Tracker is a client-side web application that allows users to record personal transactions, view a running balance, and visualize spending by category through a pie chart. All data is persisted in the browser's Local Storage. The app requires no backend, no build step, and no login — just open and use. It is built with plain HTML, CSS, and JavaScript only.

## Glossary

- **App**: The Expense Tracker web application
- **Transaction**: A single spending record with a name, amount, and category
- **Category**: One of three fixed labels grouping transactions: Food, Transport, or Fun
- **Storage**: The browser's Local Storage API used to persist all transaction data client-side
- **Transaction_List**: The scrollable UI component displaying all recorded transactions
- **Balance**: The running total of all transaction amounts displayed at the top of the App
- **Chart**: A pie chart rendered on an HTML canvas element showing spending distribution by category

---

## Requirements

### Requirement 1: Input Form

**User Story:** As a user, I want to fill in a form with a name, amount, and category, so that I can add a new transaction to my list.

#### Acceptance Criteria

1. THE App SHALL provide a form with three fields: Item Name (text input), Amount (numeric input), and Category (select with options: Food, Transport, Fun).
2. WHEN the user submits the form with all fields filled and a valid positive amount, THE App SHALL add the Transaction to the Transaction_List and persist it to Storage.
3. IF the user submits the form with any field empty, THEN THE App SHALL display a validation error and prevent the Transaction from being saved.
4. IF the user submits the form with a non-positive or non-numeric amount, THEN THE App SHALL display a validation error and prevent the Transaction from being saved.
5. WHEN a Transaction is successfully added, THE App SHALL clear the form fields to prepare for the next entry.

---

### Requirement 2: Transaction List

**User Story:** As a user, I want to see a scrollable list of all my transactions, so that I can review what I have recorded.

#### Acceptance Criteria

1. THE Transaction_List SHALL display all stored Transactions, each showing its Item Name, Amount, and Category.
2. THE Transaction_List SHALL be scrollable when the number of Transactions exceeds the visible area.
3. WHEN the user clicks the delete control on a Transaction, THE App SHALL remove that Transaction from the Transaction_List and from Storage.
4. WHEN the App loads, THE App SHALL read all Transactions from Storage and render them in the Transaction_List.

---

### Requirement 3: Total Balance

**User Story:** As a user, I want to see my total balance at the top of the page, so that I can quickly know my overall spending.

#### Acceptance Criteria

1. THE App SHALL display the Balance as the sum of all Transaction amounts at the top of the page.
2. WHEN a Transaction is added, THE App SHALL recalculate and update the Balance immediately.
3. WHEN a Transaction is deleted, THE App SHALL recalculate and update the Balance immediately.

---

### Requirement 4: Visual Chart

**User Story:** As a user, I want to see a pie chart of my spending by category, so that I can understand where my money is going.

#### Acceptance Criteria

1. THE Chart SHALL display the proportional spending distribution across the Food, Transport, and Fun categories.
2. WHEN a Transaction is added, THE App SHALL update the Chart to reflect the new spending distribution.
3. WHEN a Transaction is deleted, THE App SHALL update the Chart to reflect the revised spending distribution.
4. IF no Transactions exist, THEN THE App SHALL display an empty-state placeholder in place of the Chart.

---

### Requirement 5: Data Persistence

**User Story:** As a user, I want my transactions to be saved automatically, so that my data is still there when I reopen the browser.

#### Acceptance Criteria

1. WHEN a Transaction is added or deleted, THE App SHALL immediately write the updated Transaction data to Storage.
2. WHEN the App loads, THE App SHALL read all Transactions from Storage and restore the previous state of the Transaction_List, Balance, and Chart.
3. IF Storage is unavailable or returns a parse error, THEN THE App SHALL operate with an empty in-memory Transaction list and display a warning message.

---

### Requirement 6: Technical Constraints

**User Story:** As a developer, I want the app to use only vanilla web technologies, so that it has no dependencies or build tooling.

#### Acceptance Criteria

1. THE App SHALL be implemented using only HTML, CSS, and JavaScript with no frameworks or transpilers.
2. THE App SHALL load all styles from a single CSS file located in the `css/` directory.
3. THE App SHALL load all application logic from a single JavaScript file located in the `js/` directory.
4. THE App SHALL function correctly in modern browsers (Chrome, Firefox, Safari, Edge) without any backend or server-side component.
5. WHERE a charting library is used, THE App SHALL load it via a CDN script tag with no local build step required.

---

### Requirement 7: Dark/Light Mode Toggle

**User Story:** As a user, I want to toggle between dark and light themes, so that I can use the app comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE App SHALL provide a toggle control that switches the UI between a light theme and a dark theme.
2. WHEN the user activates the theme toggle, THE App SHALL apply the selected theme to the entire page immediately.
3. WHEN the user activates the theme toggle, THE App SHALL persist the selected theme value to Storage.
4. WHEN the App loads, THE App SHALL read the previously saved theme from Storage and apply it before rendering the UI.
5. IF no theme value exists in Storage, THEN THE App SHALL default to the light theme on load.

---

### Requirement 8: Monthly Summary Review

**User Story:** As a user, I want to see a summary of my spending grouped by month, so that I can track how much I spend over time and across categories.

#### Acceptance Criteria

1. THE App SHALL display a Monthly_Summary section that groups Transactions by calendar month and year.
2. THE Monthly_Summary SHALL show the total amount spent for each month across all categories.
3. THE Monthly_Summary SHALL show a per-category breakdown of amounts spent within each month.
4. WHEN a Transaction is added, THE App SHALL update the Monthly_Summary to reflect the new totals.
5. WHEN a Transaction is deleted, THE App SHALL update the Monthly_Summary to reflect the revised totals.
6. IF no Transactions exist, THEN THE App SHALL display an empty-state message in the Monthly_Summary section.

---

### Requirement 9: Sort Transactions

**User Story:** As a user, I want to sort my transaction list by amount or category, so that I can find and review transactions more easily.

#### Acceptance Criteria

1. THE App SHALL provide sort controls above the Transaction_List with the following options: Amount Ascending, Amount Descending, and Category A–Z.
2. WHEN the user selects a sort option, THE App SHALL re-render the Transaction_List in the chosen order.
3. THE App SHALL apply sorting as a view-only operation and SHALL NOT modify the stored order of Transactions in Storage.
4. WHEN a Transaction is added or deleted, THE App SHALL re-render the Transaction_List using the currently active sort option.
5. IF no sort option has been selected, THEN THE App SHALL display Transactions in the order they were added.

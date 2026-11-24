# WhatsReal Mobile - Customer Viewer

A small Angular app for browsing WhatsReal Mobile customers and their phone plans. You can see all customers in a list, search and filter them, and open a customer to see their full details.

## Running it

You need Node.js (I used v24) and npm.

```bash
npm install
npm start
```

Then open http://localhost:4200.

To run the tests:

```bash
npm test
```

## What it does

- Customer list showing name, email, age, plan and status
- Detail page for each customer with their info, plan and which features they have
- Search by name or email
- Filter by plan type, active/inactive, or customers with data issues
- Summary at the top: total customers, active vs inactive, count per plan, and number of records with data issues
- Pagination (5 per page)
- Loading, error, empty and "user not found" states
- Works on phone screens

## Problems I found in the data

Before writing any code I went through `db.json` and found a few issues.

1. **Duplicate ID.** Jane Smith and Krystal Johnson both have the ID `a9f08ef3-345d-4a59-93a7-849ff39da26d`. They have different names, emails and ages, so they are clearly two different people and not a repeated record.
2. **Plan mismatch.** Casey Daniels has plan type `basic` but the description says "The Lite Package".
3. **Features vary within the same plan.** For example, some Lite customers have conference calling and some don't, and the two Premium customers have different features. Because of this I show features per customer instead of assuming them from the plan type.

### How I handled the duplicate ID

I didn't want to edit `db.json` because it's the source data I was given, and quietly fixing it would hide the problem. I also didn't want to drop either customer.

Instead, the data is cleaned when the app loads it (`cleanUsers` in `src/app/services/user-service.ts`):

- The first customer keeps the original ID, so Jane's link stays the same.
- Any later customer with the same ID gets a suffix (Krystal becomes `...-2`) so both detail pages work.
- Both customers get a warning, which shows up as a warning icon next to their name in the list and as a note on their detail page.

The plan mismatch is flagged the same way. For counting and filtering I trust `plan.type` over the description, so Casey counts as Basic.

In a real project I would raise these with whoever owns the data, and the backend should enforce unique IDs. This approach just keeps the app usable and makes the problems visible in the meantime.

## Technical decisions

- I used Angular 22 with standalone components and signals. Search, filters, pagination and the summary are all `computed` signals built on top of the user list, so the page updates on its own when anything changes.
- There's no backend. `db.json` sits in `public/` and is loaded with `HttpClient`, so it behaves like an API call and could be swapped for a real endpoint later. I considered json-server, but `GET /users/:id` would only ever return the first match, so Krystal would be unreachable.
- The list and detail pages both get their data from `UserService`, so the cleaning only happens in one place.
- Plain CSS, no UI library. I didn't think one was worth it for two pages.
- The summary counts all customers, not the filtered list. The "Showing X of Y" line above the table is what reflects the current search and filters.
- I added pagination so the list keeps working as more customers are added. I set it to 5 per page so it actually shows up with the current 10 customers. The page size is one constant (`pageSize` in `user-list.ts`), so it's easy to change later. Changing the search or filters goes back to page 1.

## Testing

Unit tests (Vitest) cover:

- The data cleaning: no customers dropped, IDs made unique, warnings on both duplicates, plan mismatch detection, and the original data not being modified
- The detail page showing "User not found" for an unknown ID
- Basic creation tests for each component

I also checked the error state by pointing the service at a file that doesn't exist, and checked the layout at phone width.

## What I'd do with more time

- Show the same loading and error states on the detail page (right now only the list handles a failed request)
- Sorting by clicking the column headers
- Keep the search and filters in the URL so a filtered view can be shared or bookmarked
- Card layout instead of a scrolling table on small screens
- End-to-end tests for the main flows
- Connect to a real API, with server-side search and pagination

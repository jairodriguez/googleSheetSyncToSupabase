# Google Sheets to Supabase Synchronization Script

This repository contains a Google Apps Script that synchronizes a Google Sheet with a Supabase database. 

## How it Works

Whenever a cell in the Google Sheet is edited, the script marks the row as "changed". A separate function, which can be run periodically (for example, using Google Apps Script's built-in triggers), checks for rows marked as "changed". 

For each "changed" row, the script will:

- Create a new row in the Supabase database if the row's id does not already exist in the database.
- Update the existing row in the Supabase database if the row's id already exists in the database.

After processing a "changed" row, the script removes the "changed" flag from the row in the Google Sheet.

## Setup

1. Replace `<YOUR_SHEET_NAME>`, `<YOUR_SUPABASE_URL>`, `<YOUR_SUPABASE_API_KEY>`, `<YOUR_SUPABASE_JWT>`, and `<YOUR_SPREADSHEET_ID>` in the script with your actual values.
2. In your Google Sheet, go to Extensions > Apps Script and paste the script.
3. Set up a trigger to run the `sendUpdates` function periodically. You can do this in the Apps Script editor by clicking on the clock icon (current project's triggers).

## Note

This script uses the `onEdit` simple trigger from Google Apps Script, which means it will only run when a user manually changes a cell. It will not run when a cell's value changes due to a formula or due to an API call, however with the time trigger it will sync all changes even when made by an API call.

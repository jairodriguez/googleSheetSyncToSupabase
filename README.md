# googleSheetSyncToSupabase
This Google Apps Script synchronizes a Google Sheet with a Supabase database. It marks edited rows and periodically checks for changes, updating or creating rows in the database as needed. The script then removes the "changed" flag from processed rows in the Google Sheet.

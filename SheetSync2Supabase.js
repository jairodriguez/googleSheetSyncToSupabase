// This function is triggered whenever a cell is edited.
function onEdit(e) {
  var range = e.range;
  var sheet = range.getSheet();

  // Check if the edited sheet is the one we're interested in
  if (sheet.getName() === "<YOUR_SHEET_NAME>") {
    // Add a "changed" flag to the edited row
    var row = range.getRow();
    sheet.getRange(row, sheet.getLastColumn() + 1).setValue("changed");
  }
}

// This function checks if the id exists in the Supabase table.
function idExistsInSupabase(id) {
  var url =
    "<YOUR_SUPABASE_URL>" + id;
  var options = {
    method: "GET",
    headers: {
      apikey: "<YOUR_SUPABASE_API_KEY>",
      Authorization: "Bearer <YOUR_SUPABASE_JWT>",
    },
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch(url, options);
  var data = JSON.parse(response.getContentText());

  // If the response contains any rows, the id exists in the Supabase table
  return data.length > 0;
}

// This function sends updates to the API and is meant to be run periodically.
function sendUpdates() {
  var sheet = SpreadsheetApp.openById(
    "<YOUR_SPREADSHEET_ID>"
  ).getSheetByName("<YOUR_SHEET_NAME>");
  var data = sheet.getDataRange().getValues();

  // Assuming the first row contains headers
  var headers = data[0];
  var idIndex = headers.indexOf("id");
  var changedIndex = headers.indexOf("changed");

  for (var i = 1; i < data.length; i++) {
    var row = data[i];

    // Check if this row has been marked as changed
    if (row[row.length - 1] === "changed") {
      var id = row[idIndex];

      var payload = {};
      for (var j = 0; j < row.length; j++) {
        if (j !== idIndex && j !== changedIndex) {
          payload[headers[j]] = row[j];
        }
      }

      var url = "<YOUR_SUPABASE_URL>";
      var options = {
        headers: {
          apikey: "<YOUR_SUPABASE_API_KEY>",
          Authorization: "Bearer <YOUR_SUPABASE_JWT>",
          "Content-Type": "application/json",
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true,
      };

      if (idExistsInSupabase(id)) {
        // If the id exists in the Supabase table, we should update the row
        url += "?id=eq." + id;
        options.method = "PATCH";
      } else {
        // If the id does not exist in the Supabase table, we should create a new row
        options.method = "POST";
      }

      var response = UrlFetchApp.fetch(url, options);
      // Remove the "changed" flag
      sheet.getRange(i + 1, changedIndex + 1).clearContent();
    }
  }
}

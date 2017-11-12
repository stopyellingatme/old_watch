var os = require('os');
if (os.platform() == 'win32') {  
    var chilkat = require('chilkat_node6_win32'); 
} else if (os.platform() == 'linux') {
    if (os.arch() == 'arm') {
        var chilkat = require('chilkat_node6_arm');
    } else if (os.arch() == 'x86') {
        var chilkat = require('chilkat_node6_linux32');
    } else {
        var chilkat = require('chilkat_node6_linux64');
    }
} else if (os.platform() == 'darwin') {
    var chilkat = require('chilkat_node6_macosx');
}

function chilkatExample() {

    //  This example assumes the Chilkat API to have been previously unlocked.
    //  See Global Unlock Sample for sample code.

    var success;
    var http = new chilkat.Http();

    //  Get the JSON we'll be parsing..
    var jsonStr = http.QuickGetStr("https://www.chilkatsoft.com/exampleData/qb_customer_balance_detail_report_2.json");
    if (http.LastMethodSuccess !== true) {
        console.log(http.LastErrorText);
        return;
    }

    var json = new chilkat.JsonObject();
    json.Load(jsonStr);

    //  Let's parse the JSON into a CSV, and then save to a CSV file.
    var csv = new chilkat.Csv();
    csv.HasColumnNames = true;

    //  Set the column names of the CSV.
    var numColumns = json.SizeOfArray("Columns.Column");
    if (numColumns < 0) {
        console.log("Unable to get column names");
        return;
    }

    var i = 0;
    while (i < numColumns) {
        json.I = i;
        csv.SetColumnName(i,json.StringOf("Columns.Column[i].ColTitle"));
        i = i+1;
    }

    //  Let's get the rows.
    //  We'll ignore the Header and Summary, and just get the data.
    var row = 0;
    var numRows = json.SizeOfArray("Rows.Row[0].Rows.Row");
    if (numRows < 0) {
        console.log("Unable to get data rows");
        return;
    }

    while (row < numRows) {
        json.I = row;
        numColumns = json.SizeOfArray("Rows.Row[0].Rows.Row[i].ColData");
        var col = 0;
        while (col < numColumns) {
            json.J = col;
            csv.SetCell(row,col,json.StringOf("Rows.Row[0].Rows.Row[i].ColData[j].value"));
            col = col+1;
        }

        row = row+1;
    }

    //  Show the CSV
    console.log(csv.SaveToString());

    //  Save to a CSV file
    success = csv.SaveFile("qa_output/customerDetailReport.csv");

}

chilkatExample();

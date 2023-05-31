var express = require('express');
var cors = require('cors');
var reveal = require('reveal-sdk-node');

const app = express();
app.use(cors()); // DEVELOPMENT only! In production, configure appropriately.

app.use(express.static('public'));

/** This Data Source Item Provider resolves the id of a "local file data source item"
    to the actual file path stored in this server locally. */
const dataSourceItemProvider = async (userContext, dataSourceItem) => {
    if (dataSourceItem instanceof reveal.RVCsvDataSourceItem) {
        if (dataSourceItem.resourceItem instanceof reveal.RVLocalFileDataSourceItem) {
            if (dataSourceItem.resourceItem.id === "SampleDataA") {

                // The "local:/" prefix of the file path will be resolved with
                // the "localFileStoragePath" configuration option for the Reveal server. 
                // (See line number 28 of this source file)
                dataSourceItem.resourceItem.uri = "local:/sample-data-A.csv";
            }
        }
    }
    return dataSourceItem;
}

app.use('/', reveal({
    localFileStoragePath: "my-data-folder",
    dataSourceItemProvider: dataSourceItemProvider,
}));

app.listen(8080, () => {
    console.log(`Reveal server accepting http://localhost:8080/`);
});
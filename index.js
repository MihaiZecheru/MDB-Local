var fs = require('fs');
var Table = /** @class */ (function () {
    function Table(raw_table) {
        this.name = raw_table.name;
        this.folder = "./database/".concat(raw_table.name, "/");
        this.fieldnames = raw_table.fieldnames;
    }
    Table.prototype.get = function (id) {
        if (!fs.exists("".concat(this.folder, "/").concat(id)))
            throw new Error("Entry with id ".concat(id, " does not exist in table ").concat(this.name));
        var raw_entry = fs.readFile("".concat(this.folder, "/").concat(id));
        return JSON.parse(raw_entry);
    };
    return Table;
}());
var Database = /** @class */ (function () {
    function Database() {
    }
    Database.connect = function () {
        if (this.connected)
            throw new Error("Database already connected");
        if (!fs.existsSync(this.database_folder)) {
            fs.mkdir(this.database_folder);
        }
        if (fs.existsSync(this.tables_info_file)) {
            this.tables = fs.readFile(this.tables_info_file).split('\n').filter(function (line) { return line.length != 0; }).map(function (line) { return new Table(JSON.parse(line)); });
        }
        this.connected = true;
        console.log(this.tables);
    };
    var _a;
    _a = Database;
    Database.database_folder = "./database/";
    Database.tables_info_file = _a.database_folder + "table.info";
    Database.tables = [];
    Database.connected = false;
    return Database;
}());
Database.connect();

// Copyright (c) 2019, Taegus Cromis, The Conceal Developers
// Copyright (c) 2020, The UltraNote Developers
// Please see the included LICENSE file for more information.

const xmlbuilder = require("xmlbuilder");
const username = require('username');
const format = require("string-template");
const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const os = require("os");

// export functions
module.exports = {
  install: function (configOpts, configFileName) {
    try {
      if (process.platform == "win32") {
        var xmlFile = xmlbuilder.create('configuration');
        xmlFile.ele('id', 'UltraNoteIGuardian');
        xmlFile.ele('name', 'UltraNoteI Guardian');
        xmlFile.ele('description', 'UltraNoteI Guardian for monitoring the UltraNoteI Daemon');
        xmlFile.ele('executable', path.join(process.cwd(), 'guardian-win64.exe'));
        xmlFile.ele('arguments', '--config ' + configFileName);

        fs.writeFile("cgservice.xml", xmlFile.end({ pretty: true }), function (err) {
          if (err) {
            console.log('\nError trying to save the XML: ' + err);
          } else {
            shell.exec('cgservice.exe install');
          }
        });
      } else if (process.platform == "linux") {
        var template = fs.readFileSync("xuni-guardian.service.template", "utf8");
        var parsedData = format(template, {
          user: username.sync(),
          workDir: process.cwd(),
          execPath: path.join(process.cwd(), 'guardian-linux64'),
          configPath: configFileName
        });

        fs.writeFile("/etc/systemd/system/xuni-guardian.service", parsedData, function (err) {
          if (err) {
            console.log('\nError trying to save the service file: ' + err);
          } else {
            console.log('\nService is succesfully installed.\n');
            shell.exec('systemctl daemon-reload');
          }
        });
      } else {
        console.log("\nPlatform is not supported!\n");
      }
    } catch (err) {
      console.log(err.message);
    }
  },
  remove: function (configOpts, configFileName) {
    try {
      if (process.platform == "win32") {
        shell.exec('cgservice.exe uninstall');
      } else if (process.platform == "linux") {
        fs.unlink("/etc/systemd/system/xuni-guardian.service", function (err) {
          if (err) {
            console.log('\nError trying to remove the service: ' + err);
          } else {
            console.log('\nService is succesfully removed.\n');
          }
        });
      } else {
        console.log("\nPlatform is not supported!\n");
      }
    } catch (err) {
      console.log(err.message);
    }
  },
  start: function (configOpts, configFileName) {
    try {
      if (process.platform == "win32") {
        shell.exec('cgservice.exe start');
      } else if (process.platform == "linux") {
        shell.exec('systemctl start xuni-guardian');
        shell.exec('systemctl status xuni-guardian');
      } else {
        console.log("\nPlatform is not supported!\n");
      }
    } catch (err) {
      console.log(err.message);
    }
  },
  stop: function (configOpts, configFileName) {
    try {
      if (process.platform == "win32") {
        shell.exec('cgservice.exe stop');
      } else if (process.platform == "linux") {
        shell.exec('systemctl stop xuni-guardian');
      } else {
        console.log("\nPlatform is not supported!\n");
      }
    } catch (err) {
      console.log(err.message);
    }
  },
  status: function (configOpts, configFileName) {
    try {
      if (process.platform == "win32") {
        shell.exec('cgservice.exe status');
      } else if (process.platform == "linux") {
        shell.exec('systemctl status xuni-guardian');
      } else {
        console.log("\nPlatform is not supported!\n");
      }
    } catch (err) {
      console.log(err.message);
    }
  }
};
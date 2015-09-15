
# generate-evb

[![npm version](https://img.shields.io/npm/v/generate-evb.svg)](https://www.npmjs.com/package/generate-evb)
[![david dependencies](https://img.shields.io/david/etiktin/node-generate-evb.svg)](https://raw.githubusercontent.com/etiktin/node-generate-evb/master/package.json)
[![node engine](https://img.shields.io/node/v/generate-evb.svg)](https://raw.githubusercontent.com/etiktin/node-generate-evb/master/package.json)
[![npm license](https://img.shields.io/npm/l/generate-evb.svg)](https://raw.githubusercontent.com/etiktin/node-generate-evb/master/LICENSE)

## Goal
To help you automate the process of generating an 'Enigma Virtual Box' project file (*.evb) as part of your normal build
stage.

## Overview
[Enigma Virtual Box](http://enigmaprotector.com/en/aboutvb.html) is a great tool that allows you to package a Windows
executable with all of the data and dependencies it needs in-order to run (dlls, assets, registry entries etc.). The
tool takes care of the virtualization, so you don't need to change your code in order for this to work. The packaged
executable can read/execute files that were packed with it as if they were really in the file system and not virtualized
(e.g. if you packed `./images/logo.png` into it, you can read the file from that path).

To create a packaged executable you need to create a project file that describes what needs to be packaged along with
some other virtualization attributes. The tool offers only a GUI for creating the project and there's no builtin support
for recursively packing an entire directory. In other words, if files were changed in one of the packed folders, you had
to update the project manually using the GUI.

We offer an alternative. You can use `generate-evb` in your node build script, to pack an entire directory structure. To
update the project file, you just re-run your build script. You can also wrap your code in a `gulp`/`grunt` task if you
wish.

## Usage
Start by installing `generate-evb` locally:
```sh
npm install generate-evb --save-dev
```

Load the `generateEvb` function:
```javascript
var generateEvb = require('generate-evb');
```

The signature of `generateEvb` is:
```javascript
generateEvb(projectName, inputExe, outputExe, path2Pack, templatePath);
```
Where:
- *projectName* (String) - the file path to which we want to save the generated evb file (e.g. `build/myProject.evb`)
- *inputExe* (String) - the input executable file path. Enigma packs the files from *path2Pack* into a copy of this exe
- *outputExe* (String) - the output executable file path. Enigma saves the packed file to this path
- *path2Pack* (String) - the path to the directory with the content that we want to pack into the copy of *inputExe*
- *templatePath* (Object) - optional, will default to the files in the templates directory:
    - *project* (String) - the path to a project template
    - *dir* (String) - the path to a directory template
    - *file* (String) - the path to a file template

## Usage example

Let's say that we want to pack a Node.js project into `node.exe`. Our copy of `node.exe` is located at
`C:/Program Files (x86)/nodejs/node.exe`, so that will be our *inputExe*. The Node.js project is located at `../foo`
(all paths can be relative or absolute), so that's our *path2Pack*. We want to save the packaged executable to
`build/node.exe` so that will be our *outputExe*. And we will save the evb project to `build/packedNode.evb`, so that's
the *projectName*.

So our script will look like this:

```javascript
var generateEvb = require('generate-evb');

generateEvb('build/packedNode.evb', 'C:/Program Files (x86)/nodejs/node.exe', 'build/node.exe', '../foo');
```
After we run this script we'll have the evb project file at `build/packedNode.evb`.

To pack it, we can either open the project in `enigmavb.exe` (Enigma's GUI) and click on `Process`, or we can use
`enigmavbconsole.exe` (Enigma's CLI) to pack it (example below).

Here's an example of packing the evb project using Node.js:
```javascript
var fs = require('fs');
var child_process = require('child_process');

// Change the following paths to the actual paths used in your project
var evbCliPath = 'C:/Program Files (x86)/Enigma Virtual Box/enigmavbconsole.exe';
var projectName = 'build/packedNode.evb';
var inputExe = 'C:/Program Files (x86)/nodejs/node.exe';
var outputExe = 'build/node.exe';

child_process.execFile(evbCliPath, [projectName], function (err, stdout, stderr) {
    var success = false;
    if (!err) {
        // Sanity check (change this to what works for you):
        // Check if the output file exists and if it's bigger than the input file
        if (fs.existsSync(outputExe)) {
            success = fs.statSync(outputExe).size > fs.statSync(inputExe).size;
        }

        if (!success) {
            err = new Error('Failed to pack EVB project!\nEVB stdout:\n' + stdout + '\nEVB stderr:\n' + stderr);
        }
    }
    if (err) {
    	throw err;
    }
});
```

## Customization

It's possible to customize the project options (e.g. disable compression, add registry entries etc.).
The options are defined in 3 template files that are located at `node_modules/node-generate-evb/templates`.
Before you change them, copy the templates to a location outside of `node_modules`.

The templates are xml files that are pretty descriptive, so for most options it should be easy to figure our what needs
changing. If you can't find the option, I suggest that you will generate the project file using the default options and
use `enigmavb.exe` (Enigma's GUI) to change the options as you see fit. Then you should do a `diff` between the before
and after, so you will see what options need changing. Then you can go back to the templates copy and change them
accordingly.

To make `generateEvb` use the updated templates just pass it the optional *templatePath* object. We will use the default
templates for any missing template, so you don't have to replace all of them.
For example if you want to cancel the default file compression, you can copy the `project-template.xml` and set the
`CompressFiles` value to `false`. Then in your call to `generateEvb` you can pass
`{project: 'project-no-compression-template.xml'}` as the *templatePath* parameter.

## Alternatives

[enigmavirtualbox](https://www.npmjs.com/package/enigmavirtualbox) is a Node.js module and CLI, that offers the
following capabilities:
- Download and install EVB
- Generate a project file (currently this is pretty limited and not customizable)
- Pack the project file

You can use this module along with `generate-evb`.

## Problems?

If you encounter a bug, please file an [issue](https://github.com/etiktin/node-generate-evb/issues).

Suggestions and PRs are welcome :)

const core = require('@actions/core');
const generate = require('./generate.js');

try {
  const projectName = core.getInput('projectName');
  const inputExe = core.getInput('inputExe');
  const outputExe = core.getInput('outputExe');
  const path2Pack = core.getInput('path2Pack');
  const deleteExtractedOnExit = core.getInput('deleteExtractedOnExit');
  const compressFiles = core.getInput('compressFiles');
  const shareVirtualSystem = core.getInput('shareVirtualSystem');
  const mapExecutableWithTemporaryFile = core.getInput('mapExecutableWithTemporaryFile');
  const allowRunningOfVirtualExeFiles = core.getInput('allowRunningOfVirtualExeFiles');

  const options = {
    evbOptions: {
      deleteExtractedOnExit: deleteExtractedOnExit === 'true',
      compressFiles: compressFiles === 'true',
      shareVirtualSystem: shareVirtualSystem === 'true',
      mapExecutableWithTemporaryFile: mapExecutableWithTemporaryFile === 'true',
      allowRunningOfVirtualExeFiles: allowRunningOfVirtualExeFiles === 'true'
    }
  };

  generate(projectName, inputExe, outputExe, path2Pack, options);
} catch (error) {
  core.setFailed(error.message);
}

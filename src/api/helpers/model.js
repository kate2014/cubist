import Promise from 'bluebird';
import fs from 'fs';
import readline from 'readline';

export default {
  objVertexFaceCounter(objFilePath) {
    const metadata = {
      vertex: 0,
      face: 0
    };
    const rl = readline.createInterface({
      input: fs.createReadStream(objFilePath)
    });
    rl.on('line', line => {
      const splitLine = line.split(' ');
      if (splitLine[0] === 'v') {
        metadata.vertex += 1;
      } else if (splitLine[0] === 'f') {
        metadata.face += 1;
      }
    });

    return new Promise(resolve => {
      rl.on('close', () => {
        resolve(metadata);
      });
    });
  },
  /**
  * Return promise with an array with texture file paths from the mtl
  * @return a promise with an array (filenames) of texture files paths from the mtl
  * these paths are relative to the directory in the .mtl file
  * e.g. 'pic.png' implies that pic.png share the same folder as the mtl file
  * 'folderA/pic.png' implies that there is a subfolder folderA in the mtl file's folder
  * and pic.png is in that subfolder
  */
  mtlTexturePaths(mtlFilePath) {
    const filenames = [];
    const mapTypes = [
      'map_ka',
      'map_kd',
      'map_ks',
      'map_ns',
      'map_d',
      'map_bump',
      'disp',
      'decal',
      'bump'];
    const rl = readline.createInterface({
      input: fs.createReadStream(mtlFilePath)
    });
    rl.on('line', line => {
      const splitLine = line.split(' ');
      if (mapTypes.indexOf(splitLine[0].toLowerCase()) > -1) {
        if (filenames.indexOf(splitLine[splitLine.length - 1]) === -1) {
          filenames.push(splitLine[splitLine.length - 1]);
        }
      }
    });

    return new Promise(resolve => {
      rl.on('close', () => {
        resolve(filenames);
      });
    });
  },

/**
 * Checks if given array contains all the files in the mtl file
 * @param mtlFilePath - file path of the mtl
 * @param relativeTextureFilePaths - array of file paths RELATIVE to the mtl file's directory
 * e.g. files in <directory with mtl>/folder/pic.png
 * should be listed in the array as 'folder/pic.png'
 * files in .mtl file's directory would just be 'filename.extension'
 * @return promise with payload = {
 * allAvaible: false if relativeTextureFilePaths does not have all paths in correct format
 * filenamesArr: array of texture files paths in mtl file, in the same format above
 * }
 */
  mtlTexturesAvailable(mtlFilePath, relativeTextureFilePaths) {
    return this.mtlTexturePaths(mtlFilePath).then(filenames => {
      return new Promise(resolve => {
        const payload = {
          allAvailable: true,
          filenamesArr: filenames
        };
        for (let i = 0; i < filenames.length; i++) {
          if (relativeTextureFilePaths.indexOf(filenames[i]) === -1) {
            payload.allAvailable = false;
            break;
          }
        }
        resolve(payload);
      });
    });
  }
};

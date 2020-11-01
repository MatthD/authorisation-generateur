import * as fs from "tns-core-modules/file-system";
let documents = fs.knownFolders.currentApp();

export class FileReaderService {
  constructor() {}

  readJSON(path: string): Promise<Object> {
    let jsonFile = documents.getFile(path);
    console.log('jsonfile', jsonFile)
    return new Promise<Object>((resolve, reject) => {
      jsonFile
        .readText()
        .then((content: string) => {
          let data = <Array<Object>>JSON.parse(content);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

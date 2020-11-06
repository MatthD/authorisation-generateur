import * as fs from "tns-core-modules/file-system";
import { File, Folder } from "tns-core-modules/file-system";
import { openFile } from "tns-core-modules/utils/utils";
import * as pdfMake from "pdfmake/build/pdfmake.js";
import { State } from "./store";

declare var android: any;

let documents = fs.knownFolders.currentApp();
const basePath = android.os.Environment.getExternalStoragePublicDirectory(
  android.os.Environment.DIRECTORY_DOWNLOADS
).toString();


export class FileReaderService {
  constructor() {}

  readJSON(path: string): Promise<Object> {
    let jsonFile = documents.getFile(path);
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

export enum Choose {
  "Balade" = "BALADE",
  "Famille" = "FAMILLE",
  "Courses" = "COURSES",
  "Boulot" = "BOULOT",
  "Ecole" = "ECOLE",
}

const f = new FileReaderService();

export function generatePdf(choose: Choose, userInfos: State, currentTown=null) {

  const docDefinition = {
    content: [
      { text: "ATTESTATION DE DÉPLACEMENT DÉROGATOIRE", style: "header" },
      "En application du décret n°2020-1310 du 29 octobre 2020 prescrivant les mesures générales nécessaires pour faire face à l'épidémie de Covid19 dans le cadre de l'état d'urgence s\nanitaire\n",
      "Je soussigné(e),\n\n",
      `Mme/M. : ${userInfos.name} ${userInfos.lastname}\n\n`,
      `Né(e) le : ${getFrenchDate(userInfos.dob)} ${userInfos.tob}\n\n`,
      `Demeurant : ${userInfos.adress} ${userInfos.postalc} ${userInfos.town}\n\n`,
      "certifie que mon déplacement est lié au motif suivant (cocher la case) autorisé par le décret n°2020-1310 du 29 octobre 2020 prescrivant les mesures générales nécessaires pour faire face à l'épidémie de Covid19 dans le cadre de l'état d'urgence sanitaire\n\n",
      returnAllChoices(choose),
      `Fait à : ${currentTown || userInfos.town}\n\n`,
      `Le : ${getFrenchDate()} à ${getFrenchTime()}\n\n`,
      `Signature: ${userInfos.name[0].toUpperCase()} ${userInfos.lastname[0].toUpperCase()}`
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        margin: [0, 40, 0, 20]
      },
      subheader: {
        fontSize: 15,
        bold: true
      },
      quote: {
        italics: true
      },
      small: {
        fontSize: 8
      },
      checkbox:{
        fontSize: 13,
        bold: true
      }
    }
  };
  f.readJSON("assets/data/data.json").then(
    (res) => {
      const fonts = res["fonts"];
      pdfMake.createPdf(docDefinition, "", "", fonts).getDataUrl((dataUrl) => {
        savePdf(dataUrl);
      });
    },
    (err) => {
      console.log("Error reading json: ", err);
    }
  );
}

function savePdf(dataUrl: string) {
  let encodedData = dataUrl.toString().slice(28);

  let folder = Folder.fromPath(basePath);
  let tofile: File = folder.getFile(`authorisation-sortie-${Date.now()}.pdf`);
  if (tofile) {
    let data = android.util.Base64.decode(
      encodedData,
      android.util.Base64.DEFAULT
    );
    tofile.writeSync(data, (err) => {
      console.log("err :", err);
    });
    openFile(tofile.path);
  }
}

function getFrenchDate(date: Date = new Date()) {
  return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
}

function getFrenchTime(date: Date = new Date()) {
  return `${date.getHours()}:${date.getMinutes()}`;
}


function returnAllChoices(choose: Choose) {
  const possibilities = {
    BOULOT:
      "Déplacements entre le domicile et le lieu d’exercice de l’activité professionnelle ou un établissement d’enseignement ou de formation, déplacements professionnels ne pouvant être différés, déplacements pour un concours ou un examen",
    COURSES:
      "Déplacements pour effectuer des achats de fournitures nécessaires à l'activité professionnelle, des achats de première nécessité3 dans des établissements dont les activités demeurent autorisées, le retrait de commande et les livraisons à domicile.",
    MEDICAL:
      "Consultations, examens et soins ne pouvant être assurés à distance et l’achat de médicaments",
    FAMILLE:
      "Déplacements pour motif familial impérieux, pour l'assistance aux personnes vulnérables et précaires ou la garde d'enfants.",
    HANDICAP:
      "Déplacement des personnes en situation de handicap et leur accompagnant.",
    BALADE:
      "Déplacements brefs, dans la limite d'une heure quotidienne et dans un rayon maximal d'un kilomètre autour du domicile, liés soit à l'activité physique individuelle des personnes, à l'exclusion de toute pratique sportive collective et de toute proximité avec d'autres personnes, soit à la promenade avec les seules personnes regroupées dans un même domicile, soit aux besoins des animaux de compagnie.",
    JUSTICE:
      "Convocation judiciaire ou administrative et pour se rendre dans un service public",
    ADMINISTRATIVE:
      "Participation à des missions d'intérêt général sur demande de l'autorité administrative",
    ECOLE:
      "Déplacement pour chercher les enfants à l’école et à l’occasion de leurs activités",
  };
  return Object.keys(possibilities).map((key) => {
    return {
      columns: [
        {
          width: "auto",
          margin: [0, 8, 0, 0],
          stack: [
            {
              text: key === choose ?  "[X]" : "[ ]" ,
              style: "checkbox"
            },
          ],
        },
        {
          width: "*",
          alignment: "left",
          margin: [10, 7, 0, 7],
          stack: [
            {
              text: possibilities[key],
            },
          ],
        },
      ],
    };
  });
}

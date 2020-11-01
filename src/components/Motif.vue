
<template>
  <Page>
    <ActionBar title="Choix du Motif de sortie" />
    <FlexboxLayout
      class="container"
      flexDirection="column"
      backgroundColor="#3c495e"
    >
      <Button class="button" text="Balade" @tap="generate('Balade')" />
      <Button class="button" text="Famille" @tap="generate('Famille')" />
      <Button class="button" text="Course" @tap="generate('Course')" />
      <Button class="button" text="Boulot" @tap="generate('Boulot')" />
    </FlexboxLayout>
  </Page>
</template>
<script lang="ts">
import store from "../store";
import * as pdfMake from "pdfmake/build/pdfmake.js";
import { FileReaderService } from "../createPdf";
import * as clipboard from "nativescript-clipboard";
import { File, Folder, path } from "tns-core-modules/file-system";

declare var android: any;

const basePath = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).toString();

console.log('basepath', basePath)

const f = new FileReaderService();

export default {
  methods: {
    generate(val) {
      const docDefinition = {
        content: ["First PDF with NativeScript using pdfMake!"],
      };
      f.readJSON("assets/data/data.json").then(
        (res) => {
          const fonts = res["fonts"];
          pdfMake
            .createPdf(docDefinition, "", "", fonts)
            .getDataUrl((dataUrl) => {
              console.log("data", dataUrl);
              clipboard.setText(dataUrl);
            });
        },
        (err) => {
          console.log("Error reading json: ", err);
        }
      );
    },
  },
};
</script>
<style scoped>
.container {
  justify-content: center;
  align-items: center;
}
.button {
  width: 75%;
}
</style>
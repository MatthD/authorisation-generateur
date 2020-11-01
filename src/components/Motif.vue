
<template>
  <Page>
    <ActionBar title="Choix du Motif de sortie" />
    <FlexboxLayout
      class="container"
      flexDirection="column"
      backgroundColor="#3c495e"
    >
      <Button class="button" text="Balade" @tap="generate('BALADE')" />
      <Button class="button" text="Famille" @tap="generate('FAMILLE')" />
      <Button class="button" text="Courses" @tap="generate('COURSES')" />
      <Button class="button" text="Boulot" @tap="generate('BOULOT')" />
      <Button class="button" text="Ecole" @tap="generate('ECOLE')" />
    </FlexboxLayout>
  </Page>
</template>

<script lang="ts">
import store from "../store";
import { Choose, generatePdf } from "../createPdf";

export default {
  methods: {
    generate(val: Choose) {
      const hasFilledEveryData = Object.keys(store.state).every((key) => {
        if(key === 'motif') return true;
        return !!store.state[key];
      });
      if (!hasFilledEveryData) {
        return alert(
          "Merci de remplir tous les champs d'informations vous concernant (appuyez sur retour)"
        );
      }
      generatePdf(val, store.state);
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
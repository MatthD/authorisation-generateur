<template>
  <Page>
    <ActionBar title="Generation de votre attestation" />

    <FlexboxLayout class="container" flexDirection="column" backgroundColor="#3c495e">
      <Button class="button" text="Mes infos" @tap="goToAccount" />
      <Button class="button" text="Mon motif" @tap="goToMotif" />
    </FlexboxLayout>
  </Page>
</template>

<script>
import Account from "./Account";
import Motif from "./Motif";
export default {
  methods: {
    goToMotif() {
      this.$navigateTo(Motif);
    },
    goToAccount() {
      this.$navigateTo(Account);
    },
  },
};
</script>

<style scoped>
.container{
  justify-content: center;
  align-items: center;
}
.button{
  width: 75%
}
</style>>

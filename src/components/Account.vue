<template>
  <Page>
    <ActionBar title="Generateur d'authorisation" />
    <ScrollView orientation="vertical" :scrollBarIndicatorVisible="true">
      <StackLayout columns="*" rows="*,*">
        <Label class="message" text="Nom" />
        <TextField
          class="input"
          v-model="name"
          hint="Nom"
          autocapitalizationType="allcharacters"
        />

        <Label class="message" text="Prénom" />
        <TextField class="input" v-model="lastname" hint="Prénom" />

        <Label class="message" text="Lieu Naissance" />
        <TextField
          class="input"
          v-model="tob"
          hint="Lieu Naissance"
          autocapitalizationType="allcharacters"
        />

        <Label class="message" text="Date Naissance" />
        <DatePicker v-model="dob" />

        <Label class="message" text="Ville" />
        <TextField
          class="input"
          v-model="town"
          hint="Ville"
          autocapitalizationType="allcharacters"
        />

        <Label class="message" text="Code Postal" />
        <TextField
          class="input"
          v-model="postalc"
          hint="Code Postal"
          keyboardType="phone"
        />

        <Label class="message" text="Adresse" />
        <TextField class="input" v-model="town" hint="Adresse" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import store from "../store";

const watchingAll = Object.keys(store.state)
  .filter((prop) => prop !== "dob")
  .reduce((acc, prop) => {
    return {
      ...acc,
      [prop](val) {
        updateFieldString(prop, val);
      },
    };
  }, {});

export default {
  data() {
    return {
      ...store.state,
    };
  },
  watch: {
    ...watchingAll,
    dob(val) {
      store.commit("updateField", {
        field: "dob",
        value: new Date(val),
      });
    },
  },
};

function updateFieldString(fieldName: string, value: string) {
  console.log("pass here", fieldName, value);
  store.commit("updateField", {
    field: fieldName,
    value,
  });
}
</script>

<style scoped>
.message {
  vertical-align: center;
  text-align: center;
  font-size: 16;
  color: #aa0000;
}

.input {
  width: 75%;
  margin-bottom: 20px;
}
</style>

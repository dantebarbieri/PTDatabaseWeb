<template>
  <div id="app">
    <DbContent
      id="content"
      v-model="peerTeachers"
      :labs="labs"
    />
    <Actions 
      @new-db="updateDb"
      @new-pt="addNewPt"
      @new-labs="updateLabs"
      @save-db="download" 
    />
  </div>
</template>

<script>
import Actions from "@/components/Actions";
import DbContent from "@/components/DbContent";

export default {
  name: 'App',
  components: {
    Actions,
    DbContent
  },
  data() {
    return {
      peerTeachers: [],
      labs: []
    }
  },
  methods: {
    addNewPt(pt) {
      this.peerTeachers.push(pt);
      this.peerTeachers.sort((a, b) => {
        return a.lastname.toUpperCase().localeCompare(b.lastname.toUpperCase());
      });
    },
    download() {
      let json = JSON.stringify({
        "peerTeachers": this.peerTeachers,
        "labs": this.labs
      });

      let blob = new Blob([json], {tyoe: "application/json"});

      let a = document.createElement("a");
      let url = window.URL.createObjectURL(blob);
      a.download = "PT-Database.json";
      a.href = url;
      a.target = "_blank";
      a.style = "display: none";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url)
    },
    updateDb(pts, labs) {
      this.peerTeachers = pts;
      this.labs = labs;
    },
    updateLabs(labs) {
      this.labs = labs;
    }
  }
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  font-family: Arial, Helvatica, sans-serif;
  height: 100vh;
  max-height: 100vh;
  padding: 5px;
}

#content {
  flex: 1;
}
</style>

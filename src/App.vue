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
      @save-db="save" 
    />
  </div>
</template>

<script>
import Actions from "@/components/Actions";
import DbContent from "@/components/DbContent";

import PeerTeacher from "@/models/PeerTeacher";
import Lab from "@/models/Lab";

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
    save() {
      let json = JSON.stringify({
        "peerTeachers": this.peerTeachers,
        "labs": this.labs
      });
      localStorage.setItem("ptdb", json);
    },
    updateDb(pts, labs) {
      this.peerTeachers = pts;
      this.labs = labs;
    },
    updateLabs(labs) {
      this.labs = labs;
    }
  },
  mounted: function() {
    this._keyListener = function(e) {
      if(e.key === "s" && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        this.download();
      }
    };
    this._boundListener = this._keyListener.bind(this);
    document.addEventListener("keydown", this._boundListener);

    if(localStorage.ptdb) {
      let db;
      try {
        db = JSON.parse(localStorage.ptdb);
      } catch(e) {
        console.error("Db corrupted");
        localStorage.removeItem("ptdb");
        return;
      }

      let pts = [];
      let labs = [];

      db.peerTeachers.forEach(el => {
        pts.push(PeerTeacher.PeerTeacherFromObj(el));
      });

      db.labs.forEach(el => {
        labs.push(Lab.LabFromObj(el));
      });

      this.peerTeachers = pts;
      this.labs = labs;
    }
  },
  beforeDestroy: function() {
    document.removeEventListener("keydown", this._boundListener);
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

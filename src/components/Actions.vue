<template>
  <div class="actions">
    <FileUpload class="action-btn" :accept="'application/json'" @new-upload="newDb">Upload DB</FileUpload>
    <FileUpload
      class="action-btn"
      :accept="'.txt'"
      :multiple="true"
      @new-upload="createPt"
    >Upload PT</FileUpload>
    <FileUpload class="action-btn" :accept="'application/json'" @new-upload="newLabs">Upload Labs</FileUpload>
    <button class="btn action-btn" @click="toggleMode">By {{editByPt ? "Lab" : "PT"}}</button>
    <button class="btn action-btn" @click="$emit('save-db')">Save</button>
  </div>
</template>

<script>
import FileUpload from "@/components/shared/FileUpload";

import Lab from "@/models/Lab";
import PeerTeacher from "@/models/PeerTeacher";

export default {
  name: "Actions",
  components: {
    FileUpload,
  },
  data() {
    return {
      editByPt: true,
    };
  },
  methods: {
    createPt(files) {
      for (const file of files) {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          let newPt = new PeerTeacher();

          const namePattern = /^(.*)\s(.*)\s(?=Spring|Fall)/;
          const timePattern = /^(\d{2}:\d{2})\s-\s(\d{2}:\d{2})/;
          const daysPattern = /^((Monday|Tuesday|Wednesday|Thursday|Friday)(?:,?\s|$))+/;

          let lines = e.target.result.split("\n");
          let currDays = "";

          for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            let ptName = line.match(namePattern);
            if (ptName) {
              newPt.firstname = ptName[1];
              newPt.lastname = ptName[2];
              continue;
            }

            let daysMatch = line.match(daysPattern);
            if (daysMatch) {
              let daysList = daysMatch[0].split(", ");
              currDays = this.abbreviateDays(daysList);
              continue;
            }

            let time = line.match(timePattern);
            if (time) {
              let startTime = parseInt(time[1].replace(":", ""));
              let endTime = parseInt(time[2].replace(":", ""));
              newPt.schedule.push({
                days: currDays,
                startTime: startTime,
                endTime: endTime,
              });
            }
          }

          this.$emit("new-pt", newPt);
        };
        fileReader.readAsText(file);
      }
    },
    newDb(file) {
      let fileReader = new FileReader();

      fileReader.onload = (e) => {
        let jsonData = JSON.parse(e.target.result);

        let pts = [];
        for (let pt of jsonData.peerTeachers) {
          pts.push(PeerTeacher.PeerTeacherFromObj(pt));
        }

        let labs = [];
        for (let lab of jsonData.labs) {
          labs.push(Lab.LabFromObj(lab));
        }

        this.$emit("new-db", pts, labs);
      };

      fileReader.readAsText(file);
    },
    newLabs(file) {
      const validLabs = [
        "110",
        "111",
        "121",
        "206",
        "221",
        "222",
        "312",
        "313",
        "314",
        "315",
      ];
      let fileReader = new FileReader();

      fileReader.onload = (e) => {
        let jsonData = JSON.parse(e.target.result);
        let labs = jsonData.data;
        let newLabs = [];

        for (let lab of labs) {
          if (!validLabs.includes(lab.courseNumber)) {
            continue;
          }
          let newLab = new Lab(lab.courseNumber, lab.sequenceNumber);

          if (lab.instructionalMethod !== "Web Based") {
            for (let meeting of lab.meetingsFaculty) {
              let meetingTime = meeting.meetingTime;

              if (meetingTime.meetingTypeDescription === "Laboratory") {
                newLab.days += meetingTime.monday ? "M" : "";
                newLab.days += meetingTime.tuesday ? "T" : "";
                newLab.days += meetingTime.wednesday ? "W" : "";
                newLab.days += meetingTime.thursday ? "R" : "";
                newLab.days += meetingTime.friday ? "F" : "";

                newLab.startTime = parseInt(meetingTime.beginTime);
                newLab.endTime = parseInt(meetingTime.endTime);
                break;
              }
            }
          }
          newLabs.push(newLab);
        }

        this.$emit("new-labs", newLabs);
      };

      fileReader.readAsText(file);
    },
    toggleMode() {
      this.editByPt = !this.editByPt;
      this.$emit("toggle-mode", this.editByPt);
    },
    // Helpers
    abbreviateDays(days) {
      let result = "";

      for (let i = 0; i < days.length; i++) {
        switch (days[i]) {
          case "Monday":
            result += "M";
            break;
          case "Tuesday":
            result += "T";
            break;
          case "Wednesday":
            result += "W";
            break;
          case "Thursday":
            result += "R";
            break;
          case "Friday":
            result += "F";
            break;
        }
      }

      return result;
    },
  },
};
</script>

<style>
.actions {
  display: flex;
}

.action-btn {
  flex: 1;
  margin: 0 5px;
}

.btn {
  background-color: #500000;
  border: none;
  border-radius: 8px;
  color: #fff;
  display: inline-block;
  font-size: 1em;
  padding: 0.5em;
  text-align: center;
}

.btn:hover {
  background-color: #3c0000;
  color: #eef0f0;
}
</style>
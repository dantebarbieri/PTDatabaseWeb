<template>
  <div class="content">
    <List class="list" :items="peerTeachers" @select-row="updateCurrentPt" #default="slotProps">
      <span>{{slotProps.item.toString()}}</span>
      <button
        class="row-btn btn-maroon"
        :disabled="editByPt ? false : labConflicts(slotProps.item, currentLab)"
        @click="editByPt ? removePt(slotProps.item) : assignPt(slotProps.item)"
      >{{editByPt ? "Remove" : "Add"}}</button>
    </List>
    <List class="list" :items="labs" @select-row="updateCurrentLab" #default="slotProps">
      <span>{{slotProps.item.toString()}}</span>
      <button
        class="row-btn btn-blue"
        :disabled="editByPt ? labConflicts(currentPt, slotProps.item) : true"
        @click="assignLab(slotProps.item)"
      >Add</button>
    </List>
    <List
      class="list"
      :items="editByPt ? this.currentAssignments : this.currentPts"
      #default="slotProps"
    >
      <span>{{slotProps.item.toString()}}</span>
      <button
        class="row-btn btn-maroon"
        @click="editByPt ? unassignLab(slotProps.index) : unassignPt(slotProps.item)"
      >Remove</button>
    </List>
  </div>
</template>

<script>
import List from "@/components/shared/List";

export default {
  name: "DbContent",
  components: {
    List,
  },
  data() {
    return {
      currentPt: {},
      currentLab: {},
    };
  },
  props: {
    peerTeachers: Array,
    labs: Array,
    editByPt: Boolean,
  },
  model: {
    prop: "peerTeachers",
    event: "update-peer-teachers",
  },
  methods: {
    assignLab(lab) {
      this.currentPt.assignments.push(lab.id);
    },
    assignPt(pt) {
      pt.assignments.push(this.currentLab.id);
    },
    labConflicts(pt, lab) {
      if (pt.assignments === undefined) return true;

      return pt.assignments.includes(lab.id) || this.conflictWithPt(pt, lab);
    },
    removePt(pt) {
      if (pt === this.currentPt) {
        this.currentPt = {};
      }

      let ptIndex = this.peerTeachers.indexOf(pt);
      this.peerTeachers.splice(ptIndex, 1);
      this.$emit("update-peer-teachers", this.peerTeachers);
    },
    unassignLab(labIndex) {
      this.currentPt.assignments.splice(labIndex, 1);
    },
    unassignPt(pt) {
      let labIndex = pt.assignments.indexOf(this.currentLab.id);
      pt.assignments.splice(labIndex, 1);
    },
    updateCurrentLab(labIndex) {
      this.currentLab = this.labs[labIndex];
    },
    updateCurrentPt(ptIndex) {
      this.currentPt = this.peerTeachers[ptIndex];
    },
    //Helpers
    conflictWithAppts(appt1, appt2) {
      if (appt1.days === "" || appt2.days === "") {
        return false;
      }

      let daysConflict = false;
      for (let day of appt1.days) {
        for (let day2 of appt2.days) {
          if (day === day2) {
            daysConflict = true;
            break;
          }
        }
        if (daysConflict) {
          break;
        }
      }

      return (
        daysConflict &&
        appt1.startTime <= appt2.endTime &&
        appt2.startTime <= appt1.endTime
      );
    },
    conflictWithPt(pt, appt) {
      if (pt.schedule === undefined) {
        return true;
      }

      for (let ptappt of pt.schedule) {
        if (this.conflictWithAppts(ptappt, appt)) {
          return true;
        }
      }

      for (let ptlab of pt.assignments) {
        let labIndex = this.getLabIndex(ptlab);
        if (this.conflictWithAppts(this.labs[labIndex], appt)) {
          return true;
        }
      }

      return false;
    },
    getLabIndex(id) {
      let low = 0,
        high = this.labs.length - 1;

      while (low <= high) {
        let mid = Math.floor((low + high) / 2);

        if (this.labs[mid].id === id) {
          return mid;
        } else if (this.labs[mid].id < id) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      return -1;
    },
  },
  computed: {
    currentAssignments() {
      if (this.currentPt.assignments === undefined) return [];

      let assignments = [];
      for (let assignment of this.currentPt.assignments) {
        let labIndex = this.getLabIndex(assignment);
        if (labIndex !== -1) {
          assignments.push(this.labs[labIndex]);
        }
      }

      return assignments;
    },
    currentPts() {
      if (this.currentLab.id === undefined) return [];

      let pts = [];
      for (let pt of this.peerTeachers) {
        if (pt.assignments.includes(this.currentLab.id)) {
          pts.push(pt);
        }
      }

      return pts;
    },
  },
};
</script>

<style scoped>
.content {
  display: flex;
  min-height: 0;
}

.list {
  flex: 1;
  margin: 5px;
  overflow: auto;
}

.row-btn {
  border: none;
  border-radius: 2em;
  font-size: 1em;
  margin: 0;
  padding: 0.5em;
}

.row-btn[disabled] {
  visibility: hidden;
}

.btn-maroon {
  background: #3c0000;
  color: white;
}

.btn-maroon:hover {
  background: #230000;
}

.btn-blue {
  background: #003c71;
  color: white;
}

.btn-blue:hover {
  background: #00203d;
}
</style>
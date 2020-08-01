<template>
  <div class="content">
    <List class="list" :items="peerTeachers" @select-row="updateCurrentPt" #default="slotProps">
      <span>{{slotProps.item.toString()}}</span>
      <button class="row-btn btn-remove" @click="removePt(slotProps.index)">Remove</button>
    </List>
    <List class="list" :items="labs" #default="slotProps">
      <span>{{slotProps.item.toString()}}</span>
      <button
        class="row-btn btn-add"
        :disabled="labConflicts(currentPt, slotProps.item)"
        @click="assignLab(slotProps.index)"
      >Add</button>
    </List>
    <List class="list" :items="this.currentAssignments" #default="slotProps">
      <span>{{slotProps.item.toString()}}</span>
      <button class="row-btn btn-remove" @click="unassignLab(slotProps.index)">Remove</button>
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
    };
  },
  props: {
    peerTeachers: Array,
    labs: Array,
  },
  model: {
    prop: "peerTeachers",
    event: "update-peer-teachers",
  },
  methods: {
    assignLab(labIndex) {
      this.currentPt.assignments.push(this.labs[labIndex].id);
    },
    labConflicts(pt, lab) {
      if (pt.assignments === undefined) return true;

      return pt.assignments.includes(lab.id) || this.conflictWithPt(pt, lab);
    },
    removePt(ptIndex) {
      if (this.peerTeachers[ptIndex] === this.currentPt) {
        this.currentPt = {};
      }

      this.peerTeachers.splice(ptIndex, 1);
      this.$emit("update-peer-teachers", this.peerTeachers);
    },
    unassignLab(labIndex) {
      this.currentPt.assignments.splice(labIndex, 1);
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

.btn-remove {
  background: #3c0000;
  color: white;
}

.btn-remove:hover {
  background: #230000;
}

.btn-add {
  background: #003c71;
  color: white;
}

.btn-add:hover {
  background: #00203d;
}
</style>
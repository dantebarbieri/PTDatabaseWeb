export default class PeerTeacher {
  constructor(firstname = "", lastname = "", schedule = [], assignments = []) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.schedule = schedule;
    this.assignments = assignments;
  }

  static PeerTeacherFromObj(obj) {
    let firstname = obj.firstname ?? "";
    let lastname = obj.lastname ?? "";
    let schedule = obj.schedule ?? [];
    let assignments = obj.assignments ?? [];
    return new PeerTeacher(firstname, lastname, schedule, assignments);
  }

  get name() {
    return `${this.firstname} ${this.lastname}`;
  }

  addLab(id) {
    this.assignments.push(id);
  }

  toString() {
    return this.name;
  }
}
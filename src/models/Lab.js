export default class Lab {
  constructor(course = 0, section = 0, days = "", startTime = -1, endTime = -1) {
    this.course = course;
    this.section = section;
    this.days = days;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  static LabFromObj(obj) {
    let course = obj.course ?? 0;
    let section = obj.section ?? 0;
    let days = obj.days ?? "";
    let startTime = obj.startTime ?? -1;
    let endTime = obj.endTime ?? -1;
    return new Lab(course, section, days, startTime, endTime);
  }

  get name() {
    return `${this.course}-${this.section}`;
  }

  get info() {
    if (this.days === "") {
      return `${this.name} ONLINE`;
    } else {
      return `${this.name} ${this.days} ${Lab.timeToStr(this.startTime)} - ${Lab.timeToStr(this.endTime)}`;
    }
  }

  get id() {
    return parseInt(`${this.course}${this.section}`);
  }

  static timeToStr(time) {
    let minute = time % 100;
    let hour = Math.floor(time / 100);
    let suffix = "";

    if (minute < 10) {
      minute = `0${minute}`;
    }

    if (hour < 12) {
      suffix = "AM";
      if (hour == 0) hour = 12;
    } else {
      suffix = "PM";
      if (hour > 12) hour -= 12;
    }

    return `${hour}:${minute} ${suffix}`;
  }

  toString() {
    return this.info;
  }
}
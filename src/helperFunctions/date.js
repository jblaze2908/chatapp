export default class dateFunctions {
  addDays = (ogDate, days) => {
    let date = new Date(ogDate);
    date.setDate(date.getDate() + days);
    return date;
  };
  checkIfSameDate = (date1, date2) => {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  addZero = (num) => {
    let str = "" + num;
    if (str.length === 1) return "0" + str;
    else return str;
  };
  getFormattedTime = (d) => {
    let date = new Date(d);
    let hours = date.getHours();
    let amPm = "";
    if (hours > 12) {
      hours -= 12;
      amPm = " pm";
    } else amPm = " am";
    if (hours === 0) hours = 12;
    return hours + ":" + this.addZero(date.getMinutes()) + amPm;
  };
  getFormattedDate = (d) => {
    let date = new Date(d);
    return (
      this.addZero(date.getDate()) +
      "/" +
      this.addZero(date.getMonth() + 1) +
      "/" +
      date.getFullYear()
    );
  };
  getDisplayDate = (d) => {
    let date = new Date(d);
    if (this.checkIfSameDate(date, new Date())) return "today";
    let date2 = this.addDays(date, 1);
    if (this.checkIfSameDate(date2, new Date())) return "yesterday";
    return this.getFormattedDate(d);
  };
}

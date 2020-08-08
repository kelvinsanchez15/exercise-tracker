const arr = [
  {
    description: "tres",
    duration: 90,
    date: "2020-08-08T12:01:21.415Z",
  },
  { description: "dos", duration: 30, date: "2020-08-07T14:16:24.310Z" },
  { description: "uno", duration: 30, date: "2020-08-07T14:14:55.069Z" },
  { description: "cuatro", duration: 30, date: "2020-08-10T14:14:55.069Z" },
  { description: "cinco", duration: 30, date: "2020-08-12T14:14:55.069Z" },
];

const fromDate = new Date("2020-08-07" + "T00:00:00");
const toDate = new Date("2020-08-08" + "T23:59:59");

const dateFilter = (arr, fromDate, toDate) => {
  return (
    arr
      // Sort dates in ascending order
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      // Filter dates by range
      .filter((e) => {
        date = new Date(e.date);
        return toDate ? date >= fromDate && date <= toDate : date >= fromDate;
      })
  );
};

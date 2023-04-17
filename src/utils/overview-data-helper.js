const processAggregates = (serviceResp) => {
  let totalAbandonedCart = 0,
    totalCustomers = 0,
    totalOrder = 0,
    totalSales = 0;
  for (const clientId in serviceResp) {
    const client = serviceResp[clientId];
    totalAbandonedCart += client.totalAbandonedCart;
    totalCustomers += client.totalCustomers;
    totalOrder += client.totalOrder;
    totalSales += client.totalSales;
  }
  return { totalAbandonedCart, totalCustomers, totalOrder, totalSales };
};

const processSaleDayOfWeek = (serviceResp) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const returnVal = [];

  for (const clientId in serviceResp) {
    const client = serviceResp[clientId];
    const obj = client.salesValueByWeekDays;
    const data = daysOfWeek
      .map((day) => ({ primary: day, secondary: Math.ceil(obj[day]) }))
      .sort(
        (a, b) => daysOfWeek.indexOf(a.primary) - daysOfWeek.indexOf(b.primary)
      );
    returnVal.push({ data, label: clientId });
  }

  return returnVal;
};

const readDateInPST = (dateString) => {
  return new Date(dateString + "T00:00:00-08:00");
};

const processSalesCountByDays = (serviceResp) => {
  const returnVal = [];
  for (const clientId in serviceResp) {
    const client = serviceResp[clientId];
    const data = [];
    for (const date in client.salesCountByDays) {
      const dateInPST = readDateInPST(date);
      const value = client.salesCountByDays[date];
      data.push({ primary: dateInPST, secondary: value });
    }
    returnVal.push({ data, label: clientId });
  }
  return returnVal;
};

const processAverageOrderValueByDays = (serviceResp) => {
  const returnVal = [];
  for (const clientId in serviceResp) {
    const client = serviceResp[clientId];
    const data = [];
    for (const date in client.averageOrderValuebyDate) {
      const dateInPST = readDateInPST(date);
      const value = client.averageOrderValuebyDate[date];
      data.push({ primary: dateInPST, secondary: value });
    }
    returnVal.push({ data, label: clientId });
  }
  return returnVal;
};

export {
  processAggregates,
  processSaleDayOfWeek,
  processSalesCountByDays,
  processAverageOrderValueByDays,
};

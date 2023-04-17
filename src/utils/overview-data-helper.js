const processAggregates = (serviceResp) => {
  let totalAbandonedCart = 0,
    totalCustomers = 0,
    totalOrder = 0,
    totalSales = 0;
  for (const clientId in serviceResp) {
    const client = serviceResp[clientId]
    totalAbandonedCart += client.totalAbandonedCart;
    totalCustomers += client.totalCustomers;
    totalOrder += client.totalOrder;
    totalSales += client.totalSales;
  }
  return { totalAbandonedCart, totalCustomers, totalOrder, totalSales };
};

export { processAggregates };

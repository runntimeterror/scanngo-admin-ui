import React, { useMemo, useEffect, useState } from "react";
import { Grid, Card, Typography, CardContent, Box } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { GRADIENTS } from "../color-utils/gradients";
import dynamic from "next/dynamic";
import {
  processAggregates,
  processSaleDayOfWeek,
} from "../../utils/overview-data-helper";

const Chart = dynamic(() => import("react-charts").then((mod) => mod.Chart), {
  ssr: false,
});

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const aggrCardHeaderStyle = {
  width: `86px`,
  height: `87px`,
  background: GRADIENTS.YELLOW,
  boxShadow: `0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 152, 0,.4)`,
  borderRadius: `3px`,
  mt: `-30px`,
  position: `absolute`,
  display: `flex`,
  justifyContent: `center`,
  alignItems: `center`,
};

const chartCardHeaderStyle = {
  width: `100%`,
  height: `160px`,
  background: GRADIENTS.LIGHT_BLUE,
  boxShadow: `0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 152, 0,.4)`,
  borderRadius: `3px`,
  display: `flex`,
  justifyContent: `center`,
  alignItems: `center`,
};

function Overview() {
  const [aggregateData, setAggregateData] = useState({});
  const [saleByDayData, setSaleByDayData] = useState();

  const linedata = [
    { primary: 0, secondary: Math.random() },
    { primary: 1, secondary: Math.random() },
    { primary: 2, secondary: Math.random() },
    { primary: 3, secondary: Math.random() },
    { primary: 4, secondary: Math.random() },
    { primary: 5, secondary: Math.random() },
    { primary: 6, secondary: Math.random() },
  ];
  const primaryAxis = useMemo(
    () => ({
      getValue: (datum) => datum.primary,
    }),
    []
  );

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (datum) => datum.secondary,
      },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const resp = await fetch(`/api/overview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const serviceRespJson = await resp.json();
      //process data
      const aggregateData = processAggregates(serviceRespJson);
      setAggregateData(aggregateData);

      const sbd = processSaleDayOfWeek(serviceRespJson);
      setSaleByDayData(sbd);
    };
    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: `grid` }}>
              <Box sx={aggrCardHeaderStyle}>
                <AttachMoneyIcon sx={{ fontSize: `40px`, color: `white` }} />
              </Box>
              <Typography sx={{ justifySelf: "end" }} variant="caption">
                Total Sales
              </Typography>
              <Typography sx={{ justifySelf: "end" }} variant="h6">
                {formatter.format(aggregateData.totalSales)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: `grid` }}>
              <Box sx={aggrCardHeaderStyle}>
                <ReceiptLongIcon sx={{ fontSize: `40px`, color: `white` }} />
              </Box>
              <Typography sx={{ justifySelf: "end" }} variant="caption">
                Transactions
              </Typography>
              <Typography sx={{ justifySelf: "end" }} variant="h6">
                {aggregateData.totalOrder}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: `grid` }}>
              <Box sx={aggrCardHeaderStyle}>
                <PeopleIcon sx={{ fontSize: `40px`, color: `white` }} />
              </Box>
              <Typography sx={{ justifySelf: "end" }} variant="caption">
                Customers
              </Typography>
              <Typography sx={{ justifySelf: "end" }} variant="h6">
                {aggregateData.totalCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: `grid` }}>
              <Box sx={aggrCardHeaderStyle}>
                <RemoveShoppingCartIcon
                  sx={{ fontSize: `40px`, color: `white` }}
                />
              </Box>
              <Typography sx={{ justifySelf: "end" }} variant="caption">
                Abandoned Cart
              </Typography>
              <Typography sx={{ justifySelf: "end" }} variant="h6">
                {aggregateData.totalAbandonedCart}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={12} md={4}>
          <Card>
            <CardContent sx={{ display: `grid` }}>
              <Box sx={chartCardHeaderStyle}>
                {!!saleByDayData && (
                  <Chart
                    options={{
                      data: [...saleByDayData],
                      primaryAxis,
                      secondaryAxes,
                    }}
                  />
                )}
              </Box>
              <Typography sx={{ justifySelf: "end" }} variant="caption">
                Sales by Day of Week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Card>
            <CardContent sx={{ display: `grid` }}>
              <Box sx={chartCardHeaderStyle}>
                <Chart
                  options={{
                    data: [{ data: linedata, label: `Line` }],
                    primaryAxis: primaryAxis,
                    secondaryAxes: secondaryAxes,
                  }}
                />
              </Box>
              <Typography sx={{ justifySelf: "end" }} variant="caption">
                Sales Trend (over time)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Card>
            <CardContent sx={{ display: `grid` }}>
              <Box sx={chartCardHeaderStyle}>
                <RemoveShoppingCartIcon
                  sx={{ fontSize: `40px`, color: `white` }}
                />
              </Box>
              <Typography sx={{ justifySelf: "end" }} variant="caption">
                Average Order Value (over time)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default Overview;

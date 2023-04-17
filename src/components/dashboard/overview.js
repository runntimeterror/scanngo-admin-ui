import React, { useMemo, useEffect } from "react";
import { Grid, Card, Typography, CardContent, Box } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { GRADIENTS } from "../color-utils/gradients";
import dynamic from "next/dynamic";

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

function Overview(props) {
  const bardata = [
    { primary: `M`, secondary: Math.random() },
    { primary: `T`, secondary: Math.random() },
    { primary: `W`, secondary: Math.random() },
    { primary: `T`, secondary: Math.random() },
    { primary: `F`, secondary: Math.random() },
    { primary: `S`, secondary: Math.random() },
    { primary: `S`, secondary: Math.random() },
  ];

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
    [bardata]
  );

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (datum) => datum.secondary,
      },
    ],
    [bardata]
  );

  useEffect(async () => {
    const token = localStorage.getItem("token");
    const resp = await fetch(`/api/overview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const overviewData = await resp.json();
    debugger;
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
                {formatter.format(54292)}
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
                2342
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
                523
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
                24
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
                <Chart
                  options={{
                    data: [{ data: bardata, label: `Bar` }],
                    primaryAxis: primaryAxis,
                    secondaryAxes: secondaryAxes,
                  }}
                />
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

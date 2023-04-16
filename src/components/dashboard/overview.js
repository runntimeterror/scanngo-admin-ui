import React from "react";
import { Grid, Card, Typography, CardContent, Box } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { GRADIENTS } from "../color-utils/gradients";

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
  background: GRADIENTS.GREEN,
  boxShadow: `0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 152, 0,.4)`,
  borderRadius: `3px`,
  display: `flex`,
  justifyContent: `center`,
  alignItems: `center`,
};

function Overview(props) {
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: `grid` }}>
              <Box sx={aggrCardHeaderStyle}>
                <AttachMoneyIcon sx={{ fontSize: `40px`, color: `white` }} />
              </Box>
              <Typography sx={{ justifySelf: "end" }} variant="subtitle2">
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
              <Typography sx={{ justifySelf: "end" }} variant="subtitle2">
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
              <Typography sx={{ justifySelf: "end" }} variant="subtitle2">
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
              <Typography sx={{ justifySelf: "end" }} variant="subtitle2">
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
                <RemoveShoppingCartIcon
                  sx={{ fontSize: `40px`, color: `white` }}
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
                <RemoveShoppingCartIcon
                  sx={{ fontSize: `40px`, color: `white` }}
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

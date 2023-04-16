import React from "react";
import { Grid, Card, Typography, CardContent, Box } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const cardHeaderStyle = {
  width: `86px`,
  height: `87px`,
  background: "linear-gradient(60deg, #ffa726, #fb8c00)",
  boxShadow: `0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 152, 0,.4)`,
  borderRadius: `3px`,
  mt: `-30px`,
  position: `absolute`,
  display: `flex`,
  justifyContent: `center`,
  alignItems: `center`,
};

function Overview(props) {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ display: `grid` }}>
            <Box sx={cardHeaderStyle}>
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
            <Box sx={cardHeaderStyle}>
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
            <Box sx={cardHeaderStyle}>
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
            <Box sx={cardHeaderStyle}>
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
  );
}

export default Overview;

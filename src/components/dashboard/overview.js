import React from "react";
import { Grid, Card, CardActions, CardContent } from "@mui/material";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function Overview(props) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <p>Total Sales</p>
            <h3>{formatter.format(54292)}</h3>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <p>Transactions</p>
            <h3>2342</h3>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <p>Customers</p>
            <h3>523</h3>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <p>In Store / Online</p>
            <h3>245 / 278</h3>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Overview;

import React from "react";
import {
  GridContainer,
  GridItem,
  Card,
  CardIcon,
  CardHeader,
} from "@mui/material";

function Overview(props) {
  return (
    <GridContainer>
      <GridItem xs={12} sm={6} md={3}>
        <Card>
          <CardHeader color="warning" stats icon>
            <CardIcon color="warning">
              
            </CardIcon>
            <p className={classes.cardCategory}>Used Space</p>
            <h3 className={classes.cardTitle}>
              49/50 <small>GB</small>
            </h3>
          </CardHeader>
          <CardFooter stats>
            <div className={classes.stats}>
              <Danger>
                <Warning />
              </Danger>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                Get more space
              </a>
            </div>
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={6} md={3}>
        <Card>
          <CardHeader color="dark" stats icon>
            <CardIcon color="dark">
             
            </CardIcon>
            <p className={classes.cardCategory}>Revenue</p>
            <h3 className={classes.cardTitle}>$34,245</h3>
          </CardHeader>
          <CardFooter stats>
            <div className={classes.stats}>

              Last 24 Hours
            </div>
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={6} md={3}>
        <Card>
          <CardHeader color="danger" stats icon>
            <CardIcon color="danger">
              
            </CardIcon>
            <p className={classes.cardCategory}>Fixed Issues</p>
            <h3 className={classes.cardTitle}>75</h3>
          </CardHeader>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={6} md={3}>
        <Card>
          <CardHeader color="info" stats icon>
            <CardIcon color="info">
             
            </CardIcon>
            <p className={classes.cardCategory}>Followers</p>
            <h3 className={classes.cardTitle}>+245</h3>
          </CardHeader>
          <CardFooter stats>
            <div className={classes.stats}>
              <Update />
              Just Updated
            </div>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default Overview;

/* import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import ShareIcon from '@material-ui/icons/Share';
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone';
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone';
import NavBarAfterLogin from '../navBar/NavBarAfterLogin'

const SearchList = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 3600,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CheckboxList() {
  const classes = SearchList();
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
      
    <List className={classes.root}>
      {[0, 1, 2, 3,4,5,6].map((value) => {
        const labelId = `checkbox-list-label-${value}`;
        return (
          <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
            <ListItemIcon>
              {<Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />}
            </ListItemIcon>
            <ListItemText id={labelId} primary={`Community ${value + 1}`} />
            <ListItemSecondaryAction>
              <IconButton edge="start" aria-label="comments">
                <CommentIcon />
              </IconButton>
              <IconButton edge="end" aria-label="share">
                <ShareIcon/>
              </IconButton>
              <IconButton edge="start" aria-label="ArrowUpwardTwoTone">
                <ArrowUpwardTwoToneIcon />
              </IconButton>
              <IconButton edge="start" aria-label="ArrowDownwardTwoTone">
                <ArrowDownwardTwoToneIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
 */

import React, { useState, useEffect }from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CommentIcon from "@material-ui/icons/Comment";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { Divider, CardMedia } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { Checkbox, Container, Typography } from "@material-ui/core";
import MessageIcon from "@material-ui/icons/Message";
import LinkIcon from "@material-ui/icons/Link";
import SearchBar from "./searchbar";
import Apirequest from "../../backendRequestApi";
import axios from "axios";
import Sort from "./Sort"
export default function SearchList() {

   
 const useCardStyles = makeStyles(
  (theme) => ({
    root: {
      display: 'flex',
      width: 'auto',
      borderRadius: 0,
    },
    cardRoot: {
      maxWidth: 1000,
      marginLeft: 150,
      marginTop: 50,
    },
    paperModal: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    votesWrapper: {
      display: 'flex',
      flexDirection: 'column',
      width: 30,
      alignItems: 'center',
      backgroundColor: theme.palette.type === 'light' ? '#f7f5f3' : '#2f271f',
    },
    thumbnailWrapper: {
      alignSelf: 'center',
      marginLeft: 5,
    },
    thumbnail: {
      fontSize: '2em',
      width: 70,
      height: 90,
      textAlign: 'center',
      backgroundColor: theme.palette.type === 'light' ? '#f7f5f3' : '#2f271f',
      borderRadius: 8,
      [theme.breakpoints.down('xs')]: {
        width: 60,
        height: 80,
      },
    },
    thumbnailIcon: {
      marginTop: 30,
    },
    postInfoWrapper: {
      padding: 10,
      paddingBottom: 0,
    },
    userAndDate: {
      marginLeft: 10,
    },
    commentsBtn: {
      textTransform: 'none',
      color: theme.palette.type === 'light' ? '#787878' : '#dadada',
    },
    title: {
      marginRight: 5,
      [theme.breakpoints.down('xs')]: {
        fontSize: '1em',
        margin: 0,
      },
    },
    bottomBtns: {
      display: 'flex',
    },
  }),
  { index: 1 }
);

  const classes = useCardStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [communities, setCommunities] = useState([]);
  const [sort, setSort] = useState(10);
  const [sorted , setSorted] = useState(false)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);

  const myCommunities = [
    {
      title: "Comm1",
      Type: "Text",
      textSubmission: "Friends Reunion",
      linkSubmission: "",
      imageSubmission: "",
      community: "TestCommunity1",
      upvotedBy: 1,
      downvotedBy: 1,
    },
    {
      title: "Comm2",
      postType: "Text",
      textSubmission: "Reddit",
      linkSubmission: "",
      imageSubmission: "",
      community: "TestCommunity2",
      upvotedBy: 1,
      downvotedBy: 1,
    },
  ];

  useEffect(() => {
    getallCommunities();
  }, [sort, sorted]);

  const getallCommunities = () => {
    // const email = localStorage.getItem("email");
    const email = { email: "bhagi@gmail.com", sorted: sorted , type: sort };

    axios.defaults.withCredentials = true;
    axios
      .post(`${Apirequest}/api/community/getAllOwnerCommunities`, email)
      .then(({ data }) => {
        console.log(data);
        setCommunities(data);
      })
      .catch((error) => {
        console.log("error occured while connecting to backend:", error);
      });
  };

  return (
    <div>
      {/* <searchbar></searchbar> */}

      <SearchBar communityName={"comm1"}/>
     {/*  <Sort/> */}
    <Paper className={classes.root} variant="outlined">
    
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper className={fixedHeightPaper}>
        
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <CardContent>
                {myCommunities.map((value) => {
                  return (
                    <List className={classes.root}>
                      <ListItem>
                        <ListItemAvatar>
                          <div className={classes.votesWrapper}>
                            <Checkbox
                              icon={
                                <ArrowUpwardIcon style={{ color: "#b2b2b2" }} />
                              }
                              checkedIcon={
                                <ArrowUpwardIcon style={{ color: "#FF8b60" }} />
                              }
                              size="small"
                            />
                            <Typography
                              variant="body1"
                              style={{
                                color: "#FF8b60",
                                fontWeight: 600,
                              }}
                            >
                              {value.upvotedBy - value.downvotedBy}
                            </Typography>
                            <Checkbox
                              icon={
                                <ArrowDownwardIcon
                                  style={{ color: "#b2b2b2" }}
                                />
                              }
                              checkedIcon={
                                <ArrowDownwardIcon
                                  style={{ color: "#9494FF" }}
                                />
                              }
                              size="small"
                            />
                          </div>
                          </ListItemAvatar>
                          <ListItemAvatar>
                          <div className={classes.thumbnailWrapper}>
                            {value.postType === "Text" ? (
                              <Link
                              
                              >
                                <Paper
                                  elevation={0}
                                  square
                                  className={classes.thumbnail}
                                >
                                  <MessageIcon
                                    fontSize="inherit"
                                    className={classes.thumbnailIcon}
                                    style={{ color: "#787878" }}
                                  />
                                </Paper>
                              </Link>
                            ) : value.postType === "Link" ? (
                              <a href={value.linkSubmission} target="_noblank">
                                <Paper
                                  elevation={0}
                                  square
                                  className={classes.thumbnail}
                                >
                                  <LinkIcon
                                    fontSize="inherit"
                                    className={classes.thumbnailIcon}
                                    style={{ color: "#787878" }}
                                  />
                                </Paper>
                              </a>
                            ) : (
                              <Paper
                                elevation={0}
                                square
                                className={classes.thumbnail}
                              >
                                <CardMedia
                                  className={classes.thumbnail}
                                  image={value.imageSubmission}
                                  title={value.title}
                                  component="a"
                                  href={value.imageSubmission}
                                  target="_noblank"
                                />
                              </Paper>
                            )}
                          </div>
                        </ListItemAvatar>
                        <ListItemText
                          primary={value.title}
                          secondary={value.community}
                        />
                        <ListItemText
                          primary={value.author}
                          secondary={value.amount}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<CommentIcon />}
                          component={Link}
                        
                        />
                      </ListItem>
                      <Divider />
                    </List>
                  );
                })}
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Paper>
    </div>
  );
}



import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Navbar from "./components/NavBar/NavBar";
// import LoginForm from "./components/LoginForm/loginForm";
// import SignUp from "./components/SignupForm/signupForm";
import CommunityHomePage from "./components/CommunityHomePage/CommunityHomePage";
import CreatePost from "./components/CommunityHomePage/CreatePost";
import Post from "./components/CommunityHomePage/Post";
import ImageAndVideo from "./components/CommunityHomePage/ImageAndVideo";
import LinkPostType from "./components/CommunityHomePage/LinkPostType";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#ff4500",
      main: "#f47b4e",
      dark: "#ff4500",
      contrastText: "#fff",
    },
    seconnpdary: {
      light: "#fafafa",
      main: "#f5f5f5",
      dark: "#e0e0e0",
      contrastText: "#9e9e9e",
    },
  },
});

const App = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Switch>
          {/* <Route path="/login" exact component={LoginForm} />
          <Route path="/signup" exact component={SignUp} /> */}
          <Route path="/communityhome" exact component={CommunityHomePage} />
          <Route path="/createpost" exact component={CreatePost} />
          <Route path="/createpost/post" exact component={Post} />
          <Route path="/createpost/imageandvideo" exact component={ImageAndVideo} />
          <Route path="/createpost/link" exact component={LinkPostType} />

        </Switch>
      </ThemeProvider>
    </div>
  );
};

export default App;

import React from "react";
import { Navbar } from "./Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LogPage } from "./LogPage";
import { HistoryPage } from "./History";
import { DayHistoryPage } from "./DayHistoryPage";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/signin">
            <div>signin page</div>
          </Route>
          <Route path="/history/:year/:month/:day" component={DayHistoryPage} />
          <Route path="/history">
            <HistoryPage />
          </Route>
          <Route path="/">
            <LogPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

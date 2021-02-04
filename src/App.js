import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from "./components/Layout";

const AddEditResult = lazy(() => import("./containers/AddEditResult"));
const Leaderboard = lazy(() => import("./containers/Leaderboard"));
const ResultList = lazy(() => import("./containers/ResultList"));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div>Loading</div>}>
          <Switch>
            <Route path="/" exact component={ResultList} />
            <Route path="/new" component={AddEditResult} />
            <Route path="/edit/:id" component={AddEditResult} />
            <Route path="/leaderboard" component={Leaderboard} />
          </Switch>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;

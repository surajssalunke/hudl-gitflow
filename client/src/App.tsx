import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import { isAuthenticated } from "./util/auth";
import Main from "./pages/Main";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? <Main /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />}
        />
      </Routes>
    </Router>
  );
}

export default App;

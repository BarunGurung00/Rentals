import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";  // Correct the path to ./pages/Home
import SignUpPage from "./pages/SgnIn";  // Correct the path to ./pages/SignIn
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SignIn" element={<SignUpPage />} />
        <Route path="/Search" element={
          <ProtectedRoute> 
            <Search /> 
          </ProtectedRoute>
          } />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

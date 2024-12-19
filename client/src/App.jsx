import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Register from './pages/Registration';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Footer from './components/common/Footer';
import EbookDetailsPage from './pages/BookDetails'
import EbookPreviewPage from './pages/EbookPreviewPage';
import Wishlist from './pages/Wishlist';
import './App.css';
import SearchResults from "./pages/SearchResults";
import BrowseGenres from "./pages/BrowseGenres";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import OrderMonitoring from "./components/admin/Ordermonitor";
import UserManagement from "./components/admin/Usermanagement";



function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path = "/reset-password" element={<ResetPassword/>} />
          <Route path='/home' element={<Home />} />
          <Route path='/book/:id' element={<EbookDetailsPage />} />
          <Route path="preview/:bookId" element={<EbookPreviewPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/genres" element={<BrowseGenres />} />
          <Route path="/cart" element={<Cart />}/>
          <Route path="/wishlist" element={<Wishlist/>} />

          {/* admin */}
           <Route path="/order-monitoring" element={<OrderMonitoring/>} />
           <Route path="/user-management" element={<UserManagement/>} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;

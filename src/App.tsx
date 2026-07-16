import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Applications } from './pages/Applications';
import { ContentProvider } from './context/ContentContext';

function App() {
  return (
    <ContentProvider>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
        <WhatsAppButton />
      </HashRouter>
    </ContentProvider>
  );
}

export default App;

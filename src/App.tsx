import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Demande from "./pages/Demande";
import Dossier from "./pages/Dossier";
import Admin from "./pages/Admin";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import PolitiqueSuppressionDocuments from "./pages/PolitiqueSuppressionDocuments";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/demande" element={<Demande />} />
      <Route path="/dossier" element={<Dossier />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login isSignUp />} />
      <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
      <Route path="/politique-suppression-documents" element={<PolitiqueSuppressionDocuments />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

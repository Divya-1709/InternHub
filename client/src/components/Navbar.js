import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? "border-b border-white/10 bg-[#09090b]/80 py-3 backdrop-blur-xl" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-heading text-2xl font-semibold tracking-tight text-white">
          InternHub
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-white/60 transition-colors hover:text-white">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-white/60 transition-colors hover:text-white">How it Works</a>
          <a href="#benefits" className="text-sm font-medium text-white/60 transition-colors hover:text-white">Benefits</a>
          <div className="h-4 w-px bg-white/12" />
          <Button variant="ghost" onClick={() => navigate("/login")}>Sign In</Button>
          <Button onClick={() => navigate("/register")}>Get Started</Button>
        </div>

        <button className="p-2 text-white md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="overflow-hidden border-b border-white/10 bg-[#09090b] md:hidden"
      >
        <div className="flex flex-col gap-4 px-6 py-6">
          <a href="#features" className="text-base font-medium text-white/70" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-base font-medium text-white/70" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
          <a href="#benefits" className="text-base font-medium text-white/70" onClick={() => setIsMobileMenuOpen(false)}>Benefits</a>
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <Button variant="outline" onClick={() => navigate("/login")}>Sign In</Button>
            <Button onClick={() => navigate("/register")}>Sign Up</Button>
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;

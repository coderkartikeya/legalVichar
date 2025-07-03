'use client'
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };
  // console.log("ENV:", process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      {/* Navigation Bar */}
      <nav className={`fixed w-full z-10 transition-all duration-300 ${hasScrolled ? 'bg-white shadow-lg' : 'bg-white/10 backdrop-blur-md'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <span className={`font-serif text-2xl font-bold ${hasScrolled ? 'text-blue-900' : 'text-white'}`}>Smart Legal</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className={`flex items-center space-x-8 ${hasScrolled ? 'text-gray-700' : 'text-white'}`}>
                <button onClick={() => scrollToSection('features')} className={`hover:${hasScrolled ? 'text-blue-600' : 'text-blue-200'} transition`}>Features</button>
                <button onClick={() => scrollToSection('how-it-works')} className={`hover:${hasScrolled ? 'text-blue-600' : 'text-blue-200'} transition`}>How It Works</button>
                <button onClick={() => scrollToSection('pricing')} className={`hover:${hasScrolled ? 'text-blue-600' : 'text-blue-200'} transition`}>Pricing</button>
                <button onClick={() => scrollToSection('contact')} className={`hover:${hasScrolled ? 'text-blue-600' : 'text-blue-200'} transition`}>Contact</button>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/login" className={`${hasScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'} transition`}>Login</a>
                <a 
                  href="https://github.com/yourusername/smart-legal-assistant" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${hasScrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2"
            >
              <svg className={`w-6 h-6 ${hasScrolled ? 'text-gray-700' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg border-t border-gray-100">
              <nav className="flex flex-col p-4 space-y-3">
                <button 
                  onClick={() => { scrollToSection('features'); setIsMenuOpen(false); }} 
                  className="text-left text-gray-700 hover:text-blue-600 transition py-2"
                >
                  Features
                </button>
                <button 
                  onClick={() => { scrollToSection('how-it-works'); setIsMenuOpen(false); }} 
                  className="text-left text-gray-700 hover:text-blue-600 transition py-2"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => { scrollToSection('pricing'); setIsMenuOpen(false); }} 
                  className="text-left text-gray-700 hover:text-blue-600 transition py-2"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => { scrollToSection('contact'); setIsMenuOpen(false); }} 
                  className="text-left text-gray-700 hover:text-blue-600 transition py-2"
                >
                  Contact
                </button>
                <div className="border-t border-gray-100 pt-3">
                  
                  <a href="/login" className="block text-gray-700 hover:text-blue-600 transition py-2">Login</a>
                  <a 
                    href="https://github.com/yourusername/smart-legal-assistant" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition mt-2 justify-center"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </nav>
            </div>
          )}

            {/* Mobile Menu with updated buttons */}
            
        </div>
        
      </nav>

      {/* Hero Section with Legal Theme */}
      <header className="container mx-auto px-4 pt-32 pb-16 text-white">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="relative">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight">Revolutionize Legal <br/>Workflows with AI</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">Empowering legal professionals with cutting-edge AI technology for smarter case management and insights.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
                <span>Start Free Trial</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">Watch Demo</button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-center font-bold mb-4 text-blue-900">Powerful Legal Tools</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Advanced AI-powered features designed specifically for legal professionals</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚖️",
                title: "AI-Powered Legal Analysis",
                description: "Leverage advanced AI to analyze cases and predict outcomes based on historical data"
              },
              {
                icon: "📄",
                title: "Smart Document Management",
                description: "Organize and analyze legal documents with AI-powered insights and categorization"
              },
              {
                icon: "🤝",
                title: "Secure Client Collaboration",
                description: "Collaborate with clients securely while maintaining attorney-client privilege"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition group">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition">{feature.icon}</div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-center font-bold mb-4 text-blue-900">How It Works</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Transform your legal practice with our intuitive AI-powered workflow</p>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute left-[45px] top-0 w-1 h-full bg-blue-200 md:block hidden"></div>
              
              {/* Steps */}
              {[
                {
                  icon: "📄",
                  title: "Upload Legal Documents",
                  description: "Securely upload case files, briefs, and legal documents to our platform."
                },
                {
                  icon: "🤖",
                  title: "AI Analysis",
                  description: "Our advanced AI analyzes documents, extracts key information, and identifies relevant precedents."
                },
                {
                  icon: "📊",
                  title: "Get Insights",
                  description: "Receive detailed analysis, case predictions, and actionable recommendations."
                },
                {
                  icon: "✍️",
                  title: "Draft & Review",
                  description: "Generate AI-assisted legal drafts and collaborate with team members securely."
                }
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-8 mb-12 group">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl group-hover:scale-110 transition duration-300">
                      {step.icon}
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full rounded-full bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex-1 pt-4">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">{step.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <span className="font-serif text-xl font-bold">Smart Legal</span>
              </div>
              <p className="text-gray-400 mb-6">Empowering legal professionals with AI-driven solutions for smarter case management.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="col-span-1">
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-400 hover:text-white transition">How It Works</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="text-gray-400 hover:text-white transition">Pricing</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition">Contact</button></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="font-bold text-lg mb-4">Legal Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Legal Templates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Knowledge Base</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@smartlegal.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2024 Smart Legal Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

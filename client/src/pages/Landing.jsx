import { Link } from 'react-router-dom';
import { FileText, Globe, Sparkles, CheckCircle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Create ATS-Friendly Resumes & Portfolios with AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Generate professional resumes, cover letters, and portfolio websites in minutes. 
          Powered by AI to help you land your dream job.
        </p>
        <Link to="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 inline-block">
          Start Building Free
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <FileText className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">AI Resume Builder</h3>
            <p className="text-gray-600">
              Generate ATS-optimized resumes with professional templates and AI-enhanced content.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Globe className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Portfolio Generator</h3>
            <p className="text-gray-600">
              Create stunning portfolio websites automatically with your resume data.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Sparkles className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Cover Letters</h3>
            <p className="text-gray-600">
              Generate personalized cover letters tailored to specific job positions.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20 bg-white rounded-2xl">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose ResumeAI?</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            'ATS-friendly formatting',
            'Multiple professional templates',
            'AI-powered content enhancement',
            'One-click portfolio generation',
            'PDF & DOCX export',
            'Custom domain support'
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2024 ResumeAI. All rights reserved.</p>
      </footer>
    </div>
  );
}

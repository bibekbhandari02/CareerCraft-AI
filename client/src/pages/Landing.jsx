import { Link } from 'react-router-dom';
import { FileText, Globe, Sparkles, CheckCircle, Zap, Users, Award, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

      {/* Hero */}
      <section className="container mx-auto px-6 md:px-12 py-20 md:py-32 max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Tools
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Build Your Career with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              CareerCraft AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Create ATS-friendly resumes and stunning portfolio websites in minutes. 
            Powered by AI to help you stand out and land your dream job.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Building Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 inline-block border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-600">10K+</div>
              <div className="text-sm text-gray-600 mt-1">Resumes Created</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600">5K+</div>
              <div className="text-sm text-gray-600 mt-1">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-pink-600">98%</div>
              <div className="text-sm text-gray-600 mt-1">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 md:px-12 py-20 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed to help you create professional career documents effortlessly
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">AI Resume Builder</h3>
            <p className="text-gray-600 leading-relaxed">
              Generate ATS-optimized resumes with professional templates and AI-enhanced content that gets you noticed.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Portfolio Generator</h3>
            <p className="text-gray-600 leading-relaxed">
              Create stunning portfolio websites automatically with custom domains and beautiful dark themes.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">AI Content Writer</h3>
            <p className="text-gray-600 leading-relaxed">
              Generate personalized cover letters and professional content tailored to specific job positions.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-6 md:px-12 py-20 max-w-7xl">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose CareerCraft AI?</h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Join thousands of professionals who trust us with their career success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Zap, text: 'ATS-friendly formatting' },
              { icon: FileText, text: 'Multiple professional templates' },
              { icon: Sparkles, text: 'AI-powered content enhancement' },
              { icon: Globe, text: 'One-click portfolio generation' },
              { icon: Award, text: 'PDF & DOCX export' },
              { icon: Users, text: 'Custom domain support' }
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all duration-300">
                <div className="bg-white/20 p-2 rounded-lg">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/register" 
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 md:px-12 py-20 max-w-7xl">
        <div className="bg-white rounded-3xl p-12 md:p-16 shadow-xl border border-gray-100 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Build Your Future?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start creating professional resumes and portfolios today. No credit card required.
          </p>
          <Link 
            to="/register" 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-xl text-xl font-semibold hover:from-indigo-700 hover:to-purple-700 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Start Free Trial
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 md:px-12 py-12 max-w-7xl border-t border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerCraft AI</span>
          </div>
          <p className="text-gray-600 mb-4">
            Empowering careers with AI-powered tools
          </p>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CareerCraft AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

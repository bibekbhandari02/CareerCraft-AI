import { FileText } from 'lucide-react';

export default function Templates() {
  const templates = [
    { id: 1, name: 'Modern', preview: '/templates/modern.png' },
    { id: 2, name: 'Professional', preview: '/templates/professional.png' },
    { id: 3, name: 'Creative', preview: '/templates/creative.png' },
    { id: 4, name: 'Minimal', preview: '/templates/minimal.png' },
    { id: 5, name: 'Executive', preview: '/templates/executive.png' },
    { id: 6, name: 'Tech', preview: '/templates/tech.png' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Resume Templates</h1>
        <p className="text-center text-gray-600 mb-12">
          Choose from our collection of ATS-friendly templates
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
            >
              <div className="h-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <FileText className="w-20 h-20 text-indigo-600" />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-center">{template.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

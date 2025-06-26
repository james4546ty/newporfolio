export default function Certifications() {
  const certifications = [
    {
      id: 1,
      company: 'Skyscanner',
      title: 'Software Engineering Job Simulation',
      issued: 'January 2025',
      platform: 'Forage',
      icon: 'fas fa-plane',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-purple-600',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      titleColor: 'text-blue-400'
    },
    {
      id: 2,
      company: 'Goldman Sachs',
      title: 'Software Engineering Job Simulation',
      issued: 'October 2024',
      platform: 'Forage',
      icon: 'fas fa-chart-line',
      gradientFrom: 'from-yellow-500',
      gradientTo: 'to-orange-600',
      buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
      titleColor: 'text-yellow-400'
    },
    {
      id: 3,
      company: 'Mastercard',
      title: 'Cybersecurity Job Simulation',
      issued: 'October 2024',
      platform: 'Forage',
      icon: 'fas fa-shield-alt',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-pink-600',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      titleColor: 'text-red-400'
    }
  ];

  return (
    <section id="certifications" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="section-reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Certifications</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Professional certifications and job simulations from leading technology companies
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {certifications.map((cert) => (
              <div key={cert.id} className={`bg-gradient-to-br ${cert.gradientFrom} ${cert.gradientTo} p-0.5 rounded-2xl`}>
                <div className="bg-gray-900 bg-opacity-90 p-6 rounded-2xl h-full">
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 ${cert.buttonColor.split(' ')[0]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <i className={`${cert.icon} text-white text-2xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{cert.company}</h3>
                    <p className={`${cert.titleColor} font-semibold`}>{cert.title}</p>
                  </div>
                  <div className="space-y-2 text-gray-300 mb-6">
                    <p><strong>Issued:</strong> {cert.issued}</p>
                    <p><strong>Platform:</strong> {cert.platform}</p>
                  </div>
                  <button className={`block w-full ${cert.buttonColor} text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 text-center`}>
                    <i className="fas fa-certificate mr-2"></i>Show Credential
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

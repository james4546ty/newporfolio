import skysCertImage from "@assets/sky_1750507766705_1750945011842.png";
import goldmanCertImage from "@assets/gmc_1750507766704_1750945011837.png";
import mastercardCertImage from "@assets/cyb_1750507766703_1750945011835.png";

export default function Certifications() {
  const certifications = [
    {
      id: 1,
      company: 'Skyscanner',
      title: 'Software Engineering Job Simulation',
      issued: 'January 2025',
      platform: 'Forage',
      icon: 'fas fa-plane',
      cardColor: 'bg-blue-500',
      buttonColor: 'bg-white hover:bg-gray-100 text-blue-500',
      titleColor: 'text-white',
      textColor: 'text-blue-100',
      certImage: skysCertImage,
      credentialUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/skoQmxqhtgWmKv2pm/p3xGFkpdot5H8NBih_skoQmxqhtgWmKv2pm_QLCuExjPqmfhcSzpp_1738060306337_completion_certificate.pdf'
    },
    {
      id: 2,
      company: 'Goldman Sachs',
      title: 'Software Engineering Job Simulation',
      issued: 'October 2024',
      platform: 'Forage',
      icon: 'fas fa-chart-line',
      cardColor: 'bg-blue-600',
      buttonColor: 'bg-white hover:bg-gray-100 text-blue-600',
      titleColor: 'text-white',
      textColor: 'text-blue-100',
      certImage: goldmanCertImage,
      credentialUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Goldman%20Sachs/NPdeQ43o8P9HJmJzg_Goldman%20Sachs_QLCuExjPqmfhcSzpp_1729656516724_completion_certificate.pdf'
    },
    {
      id: 3,
      company: 'Mastercard',
      title: 'Cybersecurity Job Simulation',
      issued: 'October 2024',
      platform: 'Forage',
      icon: 'fas fa-shield-alt',
      cardColor: 'bg-red-500',
      buttonColor: 'bg-white hover:bg-gray-100 text-red-500',
      titleColor: 'text-white',
      textColor: 'text-red-100',
      certImage: mastercardCertImage,
      credentialUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/mastercard/vcKAB5yYAgvemepGQ_mfxGwGDp6WkQmtmTf_QLCuExjPqmfhcSzpp_1729915082752_completion_certificate.pdf'
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
              <div key={cert.id} className={`${cert.cardColor} rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-105`}>
                {/* Certificate Image */}
                <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
                  <img 
                    src={cert.certImage} 
                    alt={`${cert.company} Certificate`}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                
                {/* Certificate Details */}
                <div className="text-center">
                  <h3 className={`text-xl font-bold ${cert.titleColor} mb-2`}>{cert.company}</h3>
                  <p className={`${cert.titleColor} font-semibold mb-3`}>{cert.title}</p>
                  <div className={`space-y-1 ${cert.textColor} mb-6 text-sm`}>
                    <p><strong>Issued:</strong> {cert.issued} • <strong>Platform:</strong> {cert.platform}</p>
                  </div>
                  
                  {/* Show Credential Button */}
                  <a 
                    href={cert.credentialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 ${cert.buttonColor} py-2 px-6 rounded-lg font-medium transition-colors duration-300`}
                  >
                    <i className="fas fa-external-link-alt"></i>
                    Show Credential
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center">
          <p className="text-gray-400 mb-6">
            Built with <i className="fas fa-heart text-red-500 mx-1"></i> by Atharv Bhosale
          </p>
          
          <div className="flex justify-center space-x-6 mb-6">
            <a 
              href="https://github.com/Atharv1136" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
            >
              <i className="fab fa-github text-2xl"></i>
            </a>
            <a 
              href="https://www.linkedin.com/in/atharvbhosale/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-300 hover:scale-110 transform"
            >
              <i className="fab fa-linkedin text-2xl"></i>
            </a>
            <a 
              href="https://drive.google.com/file/d/1j6MtpyIlpU5GvJTfuCu0ltvcQkZyJPwX/view?usp=drive_link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-400 transition-colors duration-300 hover:scale-110 transform"
            >
              <i className="fas fa-file-pdf text-2xl"></i>
            </a>
          </div>
          
          <p className="text-gray-500 text-sm">
            © 2025 Atharv Ananda Bhosale. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

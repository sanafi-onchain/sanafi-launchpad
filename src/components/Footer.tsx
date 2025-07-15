import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white/5 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Copyright */}
          <div className="text-sm text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} Ethics - All rights reserved.
          </div>

          {/* Links Section */}
          <div className="flex flex-col md:flex-row gap-8 text-sm">
            {/* Information Links */}
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-semibold mb-2">Information</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="https://ethics.ltd/terms"
                  className="text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Terms of Use
                </Link>
                <Link
                  href="https://ethics.ltd/privacy"
                  className="text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-semibold mb-2">Social Media</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="https://x.com/ethicslaunch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  X Platform
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

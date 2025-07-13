import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white/5 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Links Section */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm">
            <Link
              href="/terms-of-use"
              className="text-gray-300 hover:text-white transition-colors hover:underline"
            >
              Terms of Use
            </Link>
            <Link
              href="/privacy-policy"
              className="text-gray-300 hover:text-white transition-colors hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/support"
              className="text-gray-300 hover:text-white transition-colors hover:underline"
            >
              Support
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-400 text-center md:text-right">
            © {new Date().getFullYear()} Ethics - Ethical Project Launchpad. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#05070a] text-gray-400 py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
        <div className="lg:col-span-2">
          <Link to="/" className="text-2xl font-extrabold text-white mb-4 inline-block">
            CODE<span className="text-brand">Canau</span>
          </Link>
          <p className="max-w-sm leading-relaxed">
            Sistem manajemen penerbitan modern dengan infrastruktur analitik cerdas berskala global.
          </p>
        </div>

        <div>
          <h5 className="text-white font-bold tracking-wider text-sm uppercase mb-6">Ecosystem</h5>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-brand transition-colors">Lumera</a></li>
            <li><a href="#" className="hover:text-brand transition-colors">Frontedge</a></li>
            <li><a href="#" className="hover:text-brand transition-colors">Sciecola</a></li>
            <li><a href="#" className="hover:text-brand transition-colors">Sciecola Debug Toolbar</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold tracking-wider text-sm uppercase mb-6">Core Engines</h5>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-brand transition-colors">SDGs NLP Classifier</a></li>
            <li><a href="#" className="hover:text-brand transition-colors">Smart Scopus Sync</a></li>
            <li><a href="#" className="hover:text-brand transition-colors">Citation Fetcher</a></li>
            <li><a href="#" className="hover:text-brand transition-colors">Global Checkout</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold tracking-wider text-sm uppercase mb-6">Network</h5>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-brand transition-colors">Sangia Publishing</a></li>
            <li><a href="#" className="hover:text-brand transition-colors">CSISC Research</a></li>
            <li><a href="#" className="hover:text-brand transition-colors">Sangia Group Inc.</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 text-sm text-center md:text-left">
        <p>&copy; {new Date().getFullYear()} CODECanau. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
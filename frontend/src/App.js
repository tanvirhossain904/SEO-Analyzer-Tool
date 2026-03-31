import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { usePDF } from 'react-to-pdf';
import { Sun, Moon, Download, Globe, ShieldCheck, Zap } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const targetRef = useRef();
  const { toPDF } = usePDF({ filename: 'SEO-Report.pdf' });

  // Dark Mode Toggle Logic
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleAudit = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Ensure URL has protocol
      let auditUrl = url;
      if (!auditUrl.startsWith('http://') && !auditUrl.startsWith('https://')) {
        auditUrl = 'https://' + auditUrl;
      }
      const res = await axios.post('http://localhost:5000/api/audit', { url: auditUrl }, {
        timeout: 15000
      });
      setResult(res.data);
      setError(null);
    } catch (err) {
      let errorMessage = 'Error connecting to server.';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (err.message === 'Network Error') {
        errorMessage = 'Cannot connect to backend server. Make sure it\'s running on port 5000.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try another URL.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('Audit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 border-b dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-black text-2xl dark:text-white">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Globe size={24}/></div>
          SEO<span className="text-blue-600">Vision</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-white transition">
            {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
          </button>
          <button className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
            Sign In
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="py-20 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 dark:text-white tracking-tight">
          Is your SEO <span className="text-blue-600">invisible?</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
          Get a professional-grade audit in seconds. We analyze your meta-data, headers, and images to help you climb the Google rankings.
        </p>

        <div className="flex flex-col md:flex-row gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-2xl border dark:border-slate-800 max-w-2xl mx-auto mb-16">
          <input 
            type="text" 
            placeholder="Paste your URL here (e.g. https://yoursite.com)"
            className="flex-1 px-4 py-3 bg-transparent focus:outline-none dark:text-white"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            onClick={handleAudit} 
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            {loading ? 'Analyzing...' : 'Start Audit'}
          </button>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 font-semibold">{error}</p>
          </div>
        )}

        {/* FEATURE CHIPS */}
        <div className="flex flex-wrap justify-center gap-8 opacity-60 dark:text-white">
          <div className="flex items-center gap-2"><ShieldCheck size={18}/> Enterprise Ready</div>
          <div className="flex items-center gap-2"><Zap size={18}/> Instant Analysis</div>
          <div className="flex items-center gap-2">📊 PDF Reports</div>
        </div>
      </section>

      {/* RESULT DASHBOARD */}
      {result && (
        <div className="max-w-5xl mx-auto pb-24 px-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold dark:text-white uppercase tracking-widest text-slate-400">Report for: {url}</h2>
            <button 
              onClick={() => toPDF()}
              className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
            >
              <Download size={18}/> Save PDF
            </button>
          </div>

          <div ref={targetRef} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-8 shadow-sm">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <MetricCard title="H1 Presence" value={result.h1Count} sub="Target: 1" status={result.h1Count === 1} />
                <MetricCard title="Description" value={result.description.length + " chars"} sub="Target: 120-160" status={result.description.length > 50} />
                <MetricCard title="Images Missing Alt" value={result.imagesWithoutAlt.length} sub="Lower is better" status={result.imagesWithoutAlt.length === 0} />
             </div>
             
             <div className="dark:text-slate-300">
                <h3 className="font-bold text-lg mb-4">Detailed Insights</h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
                   <p className="font-medium">Title Tag:</p>
                   <p className="text-slate-500 mb-4">{result.title}</p>
                   <p className="font-medium">Meta Description:</p>
                   <p className="text-slate-500">{result.description}</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Metric Card Component
function MetricCard({ title, value, sub, status }) {
  return (
    <div className="p-6 rounded-2xl border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
      <p className="text-xs font-bold text-slate-400 uppercase mb-2">{title}</p>
      <div className={`text-3xl font-black mb-1 ${status ? 'text-green-500' : 'text-red-500'}`}>{value}</div>
      <p className="text-sm text-slate-500">{sub}</p>
    </div>
  );
}

export default App;
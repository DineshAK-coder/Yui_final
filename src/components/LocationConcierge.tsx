import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MapPin, Search, Loader2, Navigation } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';

export default function LocationConcierge() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `As Yui AI's location concierge, answer this: ${query}. Focus on accessibility and real-time transit options.`,
        config: {
          tools: [{ googleMaps: {} }]
        }
      });

      setResponse(res.text || '');
      
      const chunks = res.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const mapLinks = chunks
          .filter((c: any) => c.web?.uri || c.maps?.uri)
          .map((c: any) => ({ 
            title: c.web?.title || c.maps?.title || 'Location Link', 
            uri: c.web?.uri || c.maps?.uri 
          }));
        setPlaces(mapLinks);
      } else {
        setPlaces([]);
      }
    } catch (error) {
      console.error(error);
      setResponse("Sorry, I couldn't fetch the location data at this moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="location-concierge" className="section-padding bg-surface border-t border-white/5">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="tag mb-6">{'{ Maps Grounding }'}</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter">
              Real-Time Location Concierge
            </h2>
          </div>
          <p className="text-secondary max-w-md text-lg">
            Powered by Google Maps data, Yui AI provides up-to-date, accessible venue recommendations and transit alternatives.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="relative flex items-center mb-12">
            <div className="absolute left-6 text-accent">
              <MapPin className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Find accessible cafes near Mumbai Airport"
              className="w-full bg-bg border border-white/10 rounded-full py-5 pl-16 pr-16 text-lg text-primary focus:outline-none focus:border-accent transition-colors shadow-lg"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-3 p-3 bg-accent text-bg rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
            </button>
          </form>

          {(response || loading) && (
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
              className="p-8 rounded-3xl bg-bg border border-white/5"
            >
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  <span className="ml-4 text-secondary text-lg">Analyzing location data...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 prose prose-invert prose-lg max-w-none">
                    <Markdown>{response}</Markdown>
                  </div>
                  
                  {places.length > 0 && (
                    <div className="bg-surface p-6 rounded-2xl border border-white/5 h-fit">
                      <h4 className="text-lg font-bold mb-4 flex items-center text-white">
                        <Navigation className="w-5 h-5 mr-2 text-accent" />
                        Relevant Locations
                      </h4>
                      <ul className="space-y-3">
                        {places.map((place, idx) => (
                          <li key={idx}>
                            <a 
                              href={place.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-secondary hover:text-accent transition-colors flex items-start gap-2"
                            >
                              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{place.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

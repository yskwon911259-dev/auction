'use client';

import { useState, useEffect, useCallback } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { OnBidProperty, OnbidApiType } from '@/lib/onbid-api';
import { Search, Filter, RefreshCw, LayoutGrid, List, ChevronDown, Building2, Globe, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnbidCode {
  ADDR_CD?: string;
  ADDR_NM?: string;
  CTGR_ID?: string;
  CTGR_NM?: string;
}

export default function Home() {
  const [properties, setProperties] = useState<OnBidProperty[]>([]);
  const [regions, setRegions] = useState<OnbidCode[]>([]);
  const [categories, setCategories] = useState<OnbidCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [apiType, setApiType] = useState<OnbidApiType>('general');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<OnBidProperty | null>(null);

  const mockProperties: OnBidProperty[] = [
    {
      CLTR_NO: 'MOCK-001',
      CLTR_NM: '[샘플] 서울 강남구 아파트',
      CTGR_FULL_NM: '부동산 > 주거용건물 > 아파트',
      LDNM_ADRS: '서울특별시 강남구 역삼동',
      MIN_BID_PRC: 1250000000,
      APSL_PRC: 1500000000,
      PBCT_BEGN_DTM: '2026-03-10 10:00:00',
      PBCT_CLS_DTM: '2026-03-12 18:00:00',
      PBCT_STAT_NM: '인터넷공고중',
    }
  ];

  const fetchCodes = async () => {
    try {
      const [rRes, cRes] = await Promise.all([
        fetch('/api/onbid?type=regions'),
        fetch('/api/onbid?type=categories')
      ]);
      const rData = await rRes.json();
      const cData = await cRes.json();
      if (Array.isArray(rData)) setRegions(rData);
      if (Array.isArray(cData)) setCategories(cData);
    } catch (e) {
      console.error('Failed to fetch codes');
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: apiType,
        numOfRows: '15',
      });
      if (selectedRegion) params.append('addr', selectedRegion);
      if (selectedCategory) params.append('ctgr', selectedCategory);

      const response = await fetch(`/api/onbid?${params.toString()}`);
      const data = await response.json();

      if (data.error || !Array.isArray(data) || data.length === 0) {
        setProperties(mockProperties);
      } else {
        setProperties(data);
      }
    } catch (error) {
      setProperties(mockProperties);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, [apiType, selectedRegion, selectedCategory]);

  useEffect(() => {
    fetchCodes();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProperties = properties.filter(p =>
    p.CLTR_NM.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.LDNM_ADRS.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Header Section */}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black mb-1 flex items-center gap-3">
              OnBid <span className="text-primary tracking-tighter">INSIGHT</span>
            </h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              실시간 공매 데이터 통합 대시보드
            </p>
          </motion.div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setApiType('general')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${apiType === 'general' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Globe size={16} /> 공매 전체
            </button>
            <button
              onClick={() => setApiType('kamco')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${apiType === 'kamco' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Building2 size={16} /> 캠코 물건
            </button>
          </div>
        </div>
      </header>

      {/* Advanced Filters */}
      <section className="mb-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="물건명 또는 주소 키워드 입력..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none shadow-sm font-medium"
            />
          </div>

          <div className="relative group">
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full pl-4 pr-10 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-primary appearance-none outline-none shadow-sm font-medium cursor-pointer"
            >
              <option value="">전국 - 지역</option>
              {regions.map(r => (
                <option key={r.ADDR_CD} value={r.ADDR_CD}>{r.ADDR_NM}</option>
              ))}
            </select>
          </div>

          <div className="relative group">
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-4 pr-10 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-primary appearance-none outline-none shadow-sm font-medium cursor-pointer"
            >
              <option value="">용도 - 카테고리</option>
              {categories.map(c => (
                <option key={c.CTGR_ID} value={c.CTGR_ID}>{c.CTGR_NM}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-800 text-primary' : 'text-slate-400'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-800 text-primary' : 'text-slate-400'}`}
            >
              <List size={20} />
            </button>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            총 <span className="text-primary">{filteredProperties.length}</span>건의 물건이 검색되었습니다.
          </p>
          <button
            onClick={fetchData}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary transition-all active:scale-95"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin text-primary' : 'text-slate-400'} />
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20' : 'flex flex-col gap-6 pb-20'}>
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse h-[400px] rounded-3xl"
              />
            ))
          ) : (
            filteredProperties.map((property, idx) => (
              <motion.div
                key={property.CLTR_NO || idx}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProperty(property)}
                className="cursor-pointer"
              >
                <PropertyCard property={property} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    {selectedProperty.CTGR_FULL_NM}
                  </span>
                  <button onClick={() => setSelectedProperty(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <h2 className="text-2xl font-black mb-4 leading-tight">
                  {selectedProperty.CLTR_NM}
                </h2>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">최저입찰가</p>
                    <p className="text-2xl font-black text-primary">
                      {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(selectedProperty.MIN_BID_PRC)}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">감정가</p>
                    <p className="text-2xl font-black text-slate-400 line-through decoration-slate-300">
                      {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(selectedProperty.APSL_PRC)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-400 font-semibold">소재지</span>
                    <span className="font-bold text-right ml-4">{selectedProperty.LDNM_ADRS}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-400 font-semibold">물건번호</span>
                    <span className="font-bold">{selectedProperty.CLTR_NO}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-400 font-semibold">공매기간</span>
                    <span className="font-bold">{selectedProperty.PBCT_BEGN_DTM.split(' ')[0]} ~ {selectedProperty.PBCT_CLS_DTM.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-400 font-semibold">상태</span>
                    <span className="font-bold text-primary">{selectedProperty.PBCT_STAT_NM}</span>
                  </div>
                </div>

                <button
                  onClick={() => window.open(`https://www.onbid.co.kr`, '_blank')}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:translate-y-[-2px] active:scale-[0.98] transition-all"
                >
                  <ExternalLink size={20} /> 온비드에서 입찰하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!loading && filteredProperties.length === 0 && (
        <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={40} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-bold text-2xl">검색 결과가 없습니다.</p>
          <p className="text-slate-400 mt-2">다른 지역이나 카테고리를 선택해 보세요.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedRegion(''); setSelectedCategory(''); }}
            className="mt-8 px-8 py-3 bg-primary text-white rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
          >
            모든 필터 초기화
          </button>
        </div>
      )}

      <footer className="mt-20 py-10 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-400 text-sm font-medium">
          &copy; 2026 OnBid Insight Pro. 데이터 제공: 한국자산관리공사 공공데이터포털
        </p>
      </footer>
    </main>
  );
}

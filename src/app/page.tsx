'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { OnBidProperty } from '@/lib/onbid-api';
import { Search, Filter, RefreshCw, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [properties, setProperties] = useState<OnBidProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // mock data for initial UI demonstration
  const mockProperties: OnBidProperty[] = [
    {
      CLTR_NO: '12345678',
      CLTR_NM: '서울 강남구 역삼동 아파트 (32평형)',
      CTGR_FULL_NM: '부동산 > 주거용건물 > 아파트',
      LDNM_ADRS: '서울특별시 강남구 역삼동 123-45',
      MIN_BID_PRC: 1250000000,
      APSL_PRC: 1500000000,
      PBCT_BEGN_DTM: '2026-03-10 10:00:00',
      PBCT_CLS_DTM: '2026-03-12 18:00:00',
      PBCT_STAT_NM: '인터넷공고중',
      SCRN_GRP_CD: '0001'
    },
    {
      CLTR_NO: '87654321',
      CLTR_NM: '경기 성남시 판동 단독주택',
      CTGR_FULL_NM: '부동산 > 주거용건물 > 단독주택',
      LDNM_ADRS: '경기도 성남시 분당구 판교동 678',
      MIN_BID_PRC: 890000000,
      APSL_PRC: 1200000000,
      PBCT_BEGN_DTM: '2026-03-15 09:00:00',
      PBCT_CLS_DTM: '2026-03-17 17:00:00',
      PBCT_STAT_NM: '인터넷공고중',
      SCRN_GRP_CD: '0001'
    },
    {
      CLTR_NO: '55667788',
      CLTR_NM: '부산 해운대구 마린시티 오피스텔',
      CTGR_FULL_NM: '부동산 > 주거용건물 > 오피스텔',
      LDNM_ADRS: '부산광역시 해운대구 우동 1000',
      MIN_BID_PRC: 450000000,
      APSL_PRC: 450000000,
      PBCT_BEGN_DTM: '2026-03-20 10:00:00',
      PBCT_CLS_DTM: '2026-03-22 18:00:00',
      PBCT_STAT_NM: '입찰진행중',
      SCRN_GRP_CD: '0001'
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/onbid');
      const data = await response.json();
      if (data.error || !Array.isArray(data)) {
        console.warn('Using mock data because API key is missing or error occurred');
        setProperties(mockProperties);
      } else {
        setProperties(data);
      }
    } catch (error) {
      setProperties(mockProperties);
    } finally {
      setTimeout(() => setLoading(false), 800); // add a slight delay for better UX
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProperties = properties.filter(p =>
    p.CLTR_NM.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.LDNM_ADRS.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-black mb-2 tracking-tight"
            >
              OnBid <span className="gradient-text">Insight</span>
            </motion.h1>
            <p className="text-muted-foreground max-w-2xl">
              실시간 온비드 공매 물건 데이터를 분석하여 투자 기회를 놓치지 마세요.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-border flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-muted'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-muted'}`}
              >
                <List size={18} />
              </button>
            </div>
            <button
              onClick={fetchData}
              className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-border hover:border-primary transition-all active:scale-95"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="지역명, 물건명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 rounded-2xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none shadow-sm"
          />
        </div>
        <button className="px-6 py-4 bg-white dark:bg-slate-800 rounded-2xl border border-border flex items-center gap-2 font-semibold hover:bg-muted transition-colors shadow-sm">
          <Filter size={20} />
          상세 필터
        </button>
      </section>

      {/* Stats Summary */}
      {!loading && (
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '전체 물건', value: properties.length },
            { label: '검색 결과', value: filteredProperties.length },
            { label: '평균 할인율', value: '24%' },
            { label: '오늘 마감', value: '3건' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-border shadow-sm text-center"
            >
              <p className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dashboard Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'flex flex-col gap-6'}>
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-muted animate-pulse h-96 rounded-2xl"
              />
            ))
          ) : (
            filteredProperties.map((property) => (
              <PropertyCard key={property.CLTR_NO} property={property} />
            ))
          )}
        </AnimatePresence>
      </div>

      {filteredProperties.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">검색 결과가 없습니다.</p>
          <button onClick={() => setSearchTerm('')} className="mt-4 text-primary font-bold hover:underline">
            검색어 초기화
          </button>
        </div>
      )}
    </main>
  );
}

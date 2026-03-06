'use client';

import { OnBidProperty } from '@/lib/onbid-api';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Tag, TrendingUp } from 'lucide-react';

interface PropertyCardProps {
    property: OnBidProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const discountRate = property.APSL_PRC > 0
        ? Math.round(((property.APSL_PRC - property.MIN_BID_PRC) / property.APSL_PRC) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-card text-card-foreground rounded-2xl shadow-lg overflow-hidden border border-border flex flex-col h-full"
        >
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-semibold">
                        {property.CTGR_FULL_NM.split(' > ').pop()}
                    </span>
                    {discountRate > 0 && (
                        <span className="flex items-center gap-1 text-red-500 font-bold text-sm">
                            <TrendingUp size={14} />
                            {discountRate}% 저렴
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-2 leading-tight">
                    {property.CLTR_NM}
                </h3>

                <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                        <MapPin size={16} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{property.LDNM_ADRS}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="shrink-0" />
                        <span>{property.PBCT_BEGN_DTM.split(' ')[0]} 시작</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tag size={16} className="shrink-0" />
                        <span>{property.PBCT_STAT_NM}</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">최저입찰가</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-primary">
                            {formatPrice(property.MIN_BID_PRC)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(property.APSL_PRC)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 bg-muted/50 flex justify-between items-center">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    물건번호: {property.CLTR_NO}
                </span>
                <button className="text-sm font-bold text-primary hover:underline">
                    상세보기
                </button>
            </div>
        </motion.div>
    );
}

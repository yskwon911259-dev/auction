import { XMLParser } from 'fast-xml-parser';

const ONBID_API_KEY = process.env.ONBID_API_KEY;
const ONBID_BASE_URL = 'http://openapi.onbid.co.kr/openapi/services';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
});

export interface OnBidProperty {
  CLTR_NO: string; // 물건번호
  CLTR_NM: string; // 물건명
  CTGR_FULL_NM: string; // 카테고리
  LDNM_ADRS: string; // 소재지
  MIN_BID_PRC: number; // 최저입찰가
  APSL_PRC: number; // 감정가
  PBCT_BEGN_DTM: string; // 공매시작일시
  PBCT_CLS_DTM: string; // 공매종료일시
  PBCT_STAT_NM: string; // 공매상태
  SCRN_GRP_CD: string; // 화면그룹코드
}

export async function fetchOnBidProperties(params: Record<string, string> = {}) {
  if (!ONBID_API_KEY) {
    throw new Error('ONBID_API_KEY is not defined');
  }

  const queryParams = new URLSearchParams({
    serviceKey: decodeURIComponent(ONBID_API_KEY),
    numOfRows: '10',
    pageNo: '1',
    ...params,
  });

  const url = `${ONBID_BASE_URL}/KamcoOnbidPropertyInfoService/getKamcoPropertyInfoList?${queryParams.toString()}`;
  
  const response = await fetch(url);
  const xmlData = await response.text();
  const result = parser.parse(xmlData);

  const items = result?.response?.body?.items?.item;
  return Array.isArray(items) ? items : items ? [items] : [];
}

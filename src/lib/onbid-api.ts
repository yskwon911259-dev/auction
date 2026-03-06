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
  // Additional fields for Kamco or Detailed Info
  BID_MTD_NM?: string; // 입찰방식
  ORG_NM?: string; // 집행기관
  PBCT_NO?: string; // 공고번호
}

export type OnbidApiType = 'general' | 'kamco' | 'regions' | 'categories' | 'detail';

interface FetchParams {
  pageNo?: string;
  numOfRows?: string;
  cltrNo?: string; // for detail
  pbctNo?: string; // for detail
  [key: string]: string | undefined;
}

export async function fetchOnBidData(type: OnbidApiType = 'general', params: FetchParams = {}) {
  if (!ONBID_API_KEY) {
    throw new Error('ONBID_API_KEY is not defined');
  }

  const queryParams = new URLSearchParams({
    serviceKey: decodeURIComponent(ONBID_API_KEY),
    numOfRows: params.numOfRows || '10',
    pageNo: params.pageNo || '1',
    ...params,
  });

  let endpoint = '';
  let serviceName = '';

  switch (type) {
    case 'kamco':
      serviceName = 'KamcoPbctCltrInfoService';
      endpoint = 'getKamcoPbctCltrList';
      break;
    case 'regions':
      serviceName = 'OnbidCodeInfoService';
      endpoint = 'getOnbidAddrInfo';
      break;
    case 'categories':
      serviceName = 'OnbidCodeInfoService';
      endpoint = 'getOnbidCltrCtgrInfo';
      break;
    case 'detail':
      serviceName = 'KamcoOnbidPropertyInfoService';
      endpoint = 'getKamcoPropertyDetailInfo';
      break;
    case 'general':
    default:
      serviceName = 'KamcoOnbidPropertyInfoService';
      endpoint = 'getKamcoPropertyInfoList';
  }

  const url = `${ONBID_BASE_URL}/${serviceName}/${endpoint}?${queryParams.toString()}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`API response error: ${response.status}`);

  const xmlData = await response.text();
  const result = parser.parse(xmlData);

  if (result?.response?.header?.resultCode !== '00') {
    const errorMsg = result?.response?.header?.resultMsg || 'Unknown API Error';
    console.error(`OnBid API Error [${type}]:`, errorMsg);
    throw new Error(errorMsg);
  }

  const items = result?.response?.body?.items?.item;
  return Array.isArray(items) ? items : items ? [items] : [];
}

export type PriceLevel = '$' | '$$' | '$$$' | '$$$$';
export type Category = '早餐' | '午餐' | '晚餐' | '點心' | '甜點';

export interface MenuItem {
    name: string;
    price: number;
    deliveryPrice: number;
    imageUrl?: string;
}

export interface Restaurant {
    id: string;
    name: string;
    type: Category;
    cuisine: string;
    priceLevel: PriceLevel;
    rating: number;
    user_ratings_total: number;
    reviewCount: number;
    distance: number; // in meters
    mustTry: string[];
    waitTime: number; // in minutes
    reservationInfo: string;
    reservationLink?: string;
    advanceBookingDays: number;
    deals: string[];
    paymentMethods: string[];
    deliveryPriceDiff: number; // Percentage higher on delivery apps
    imageUrl: string;
    description: string;
    atmosphere: string[];
    menu: MenuItem[];
    reviewAnalysis: {
        isIncentivized: boolean;
        positivePoints: string[];
        negativePoints: string[];
    };
    isOpen: boolean;
}

// Helper to generate consistent mock details for real API data
export function generateMockDetails(id: string, name: string, googleTypes: string[] = []): Partial<Restaurant> {
    // Use a simple hash of the ID to make "random" values consistent for the same restaurant
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pseudoRandom = (seed: number) => {
        const x = Math.sin(hash + seed) * 10000;
        return x - Math.floor(x);
    };

    const cuisines = ['台式', '日式', '美式', '義式', '韓式', '泰式'];
    const atmospheres = ['熱鬧', '安靜', '浪漫', '適合家庭', '復古', '現代'];
    const paymentMethods = ['現金', '信用卡', 'LinePay', 'ApplePay', '街口支付'];

    // Smart Category Mapping
    let type: Category = '午餐'; // Default
    if (googleTypes.includes('bakery') || googleTypes.includes('cafe') || name.includes('咖啡') || name.includes('甜點')) {
        type = '甜點';
    } else if (googleTypes.includes('bar') || googleTypes.includes('night_club') || name.includes('居酒屋') || name.includes('酒吧')) {
        type = '晚餐';
    } else if (name.includes('早餐') || name.includes('早午餐')) {
        type = '早餐';
    } else if (pseudoRandom(0) > 0.7) {
        type = '晚餐';
    }

    const mockMenus: MenuItem[] = [
        { name: '招牌套餐', price: 200, deliveryPrice: 240, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80' },
        { name: '人氣主餐', price: 180, deliveryPrice: 210, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
        { name: '特製點心', price: 100, deliveryPrice: 120, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&q=80' },
        { name: '清爽飲品', price: 60, deliveryPrice: 75, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80' },
    ];

    const cuisineMustTry: Record<string, string[]> = {
        '台式': ['滷肉飯', '牛肉麵', '蚵仔煎', '珍珠奶茶', '鹹酥雞'],
        '日式': ['生魚片', '豚骨拉麵', '天婦羅', '壽司拼盤', '日式咖哩'],
        '美式': ['培根起司堡', '水牛城辣雞翅', '炭烤豬肋排', '凱薩沙拉', '松露薯條'],
        '義式': ['瑪格麗特披薩', '奶油培根義大利麵', '提拉米蘇', '燉飯', '義式濃縮'],
        '韓式': ['韓式炸雞', '石鍋拌飯', '海鮮煎餅', '辣炒年糕', '部隊鍋'],
        '泰式': ['月亮蝦餅', '打拋豬', '冬蔭功湯', '綠咖哩雞', '泰式奶茶'],
    };

    const possibleDeals = [
        '當月壽星享8折優惠',
        '打卡送精緻小菜',
        '平日午間套餐85折',
        '刷國泰/中信卡享9折',
        'Google評論5星送飲料',
        '外帶自取滿500折50',
    ];

    const selectedCuisine = cuisines[Math.floor(pseudoRandom(1) * cuisines.length)];
    const cuisineItems = cuisineMustTry[selectedCuisine] || ['招牌特餐', '主廚推薦'];

    // Pick 2-3 random items from the cuisine list
    const mustTry = cuisineItems
        .sort(() => 0.5 - pseudoRandom(13))
        .slice(0, Math.floor(pseudoRandom(4) * 2) + 2);

    // Pick 0-2 random deals
    const deals = possibleDeals
        .sort(() => 0.5 - pseudoRandom(14))
        .slice(0, pseudoRandom(8) > 0.6 ? Math.floor(pseudoRandom(15) * 2) + 1 : 0);

    return {
        cuisine: selectedCuisine,
        type: type,
        priceLevel: ['$', '$$', '$$$', '$$$$'][Math.floor(pseudoRandom(3) * 4)] as PriceLevel,
        mustTry: mustTry,
        waitTime: Math.floor(pseudoRandom(5) * 60),
        reservationInfo: pseudoRandom(6) > 0.5 ? '需提前預訂' : '無需訂位',
        advanceBookingDays: Math.floor(pseudoRandom(7) * 14),
        deals: deals,
        paymentMethods: paymentMethods.slice(0, Math.floor(pseudoRandom(9) * 3) + 2),
        deliveryPriceDiff: Math.floor(pseudoRandom(10) * 20) + 10,
        description: `這是一間位於您附近的優質餐廳，提供美味的${name}料理。`,
        atmosphere: atmospheres.slice(0, Math.floor(pseudoRandom(11) * 3) + 1),
        menu: mockMenus,
        reviewAnalysis: {
            isIncentivized: pseudoRandom(12) > 0.8,
            positivePoints: ['食材新鮮', '服務親切', '環境整潔', 'CP值高'].slice(0, 3),
            negativePoints: ['停車不便', '人多需等候', '座位較少'].slice(0, 2),
        },
        isOpen: true, // Default to open for mocks/fallbacks
    };
}

export const restaurants: Restaurant[] = [
    {
        id: '1',
        name: '晨間陽光早午餐',
        type: '早餐',
        cuisine: '早午餐',
        priceLevel: '$$',
        rating: 4.5,
        reviewCount: 120,
        user_ratings_total: 120,
        distance: 300,
        mustTry: ['班尼迪克蛋', '酪梨吐司'],
        waitTime: 15,
        reservationInfo: '僅現場候位',
        advanceBookingDays: 0,
        deals: ['早上9點前點餐送咖啡'],
        paymentMethods: ['現金', 'LinePay'],
        deliveryPriceDiff: 15,
        imageUrl: 'https://images.unsplash.com/photo-1533089862017-5614ec87e284?auto=format&fit=crop&w=800&q=80',
        description: '美好的一天從這裡開始。',
        atmosphere: ['溫馨', '明亮'],
        menu: [
            { name: '班尼迪克蛋', price: 280, deliveryPrice: 320, imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=400&q=80' },
            { name: '酪梨吐司', price: 250, deliveryPrice: 290, imageUrl: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?auto=format&fit=crop&w=400&q=80' },
            { name: '美式咖啡', price: 80, deliveryPrice: 95, imageUrl: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=400&q=80' },
        ],
        reviewAnalysis: {
            isIncentivized: false,
            positivePoints: ['食材新鮮', '咖啡好喝', '環境舒適'],
            negativePoints: ['出餐速度慢', '座位擁擠'],
        },
        isOpen: true,
    },
    {
        id: '2',
        name: '夜貓拉麵',
        type: '晚餐',
        cuisine: '日式',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 850,
        user_ratings_total: 850,
        distance: 1200,
        mustTry: ['豚骨拉麵', '日式煎餃'],
        waitTime: 45,
        reservationInfo: '不可訂位',
        advanceBookingDays: 0,
        deals: [],
        paymentMethods: ['現金'],
        deliveryPriceDiff: 20,
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
        description: '深夜裡的道地拉麵。',
        atmosphere: ['熱鬧', '道地'],
        menu: [
            { name: '豚骨拉麵', price: 220, deliveryPrice: 260, imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=400&q=80' },
            { name: '日式煎餃', price: 80, deliveryPrice: 100, imageUrl: 'https://images.unsplash.com/photo-1541696490-8744a5dc0228?auto=format&fit=crop&w=400&q=80' },
            { name: '唐揚雞', price: 120, deliveryPrice: 150, imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=400&q=80' },
        ],
        reviewAnalysis: {
            isIncentivized: true,
            positivePoints: ['湯頭濃郁', '麵條Q彈', '營業到很晚'],
            negativePoints: ['排隊很久', '湯頭太鹹'],
        },
        isOpen: true,
    },
    {
        id: '3',
        name: '甜蜜逃脫',
        type: '甜點',
        cuisine: '烘焙',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 200,
        user_ratings_total: 200,
        distance: 500,
        mustTry: ['草莓蛋糕', '抹茶拿鐵'],
        waitTime: 0,
        reservationInfo: '無需訂位',
        advanceBookingDays: 0,
        deals: ['買三送一'],
        paymentMethods: ['現金', 'ApplePay', '信用卡'],
        deliveryPriceDiff: 10,
        imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
        description: '城裡最好吃的蛋糕。',
        atmosphere: ['安靜', '可愛', '浪漫'],
        menu: [
            { name: '草莓蛋糕', price: 150, deliveryPrice: 165, imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80' },
            { name: '抹茶拿鐵', price: 120, deliveryPrice: 135, imageUrl: 'https://images.unsplash.com/photo-1515823664-b6e165be8366?auto=format&fit=crop&w=400&q=80' },
        ],
        reviewAnalysis: {
            isIncentivized: false,
            positivePoints: ['蛋糕不甜膩', '拍照好看', '店員親切'],
            negativePoints: ['低消一杯飲料', '限時90分鐘'],
        },
        isOpen: true,
    },
    {
        id: '4',
        name: '漢堡大王',
        type: '午餐',
        cuisine: '美式',
        priceLevel: '$',
        rating: 4.2,
        reviewCount: 500,
        user_ratings_total: 500,
        distance: 800,
        mustTry: ['雙層起司堡', '洋蔥圈'],
        waitTime: 10,
        reservationInfo: '無需訂位',
        advanceBookingDays: 0,
        deals: [],
        paymentMethods: ['現金', '信用卡', 'LinePay'],
        deliveryPriceDiff: 25,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        description: '多汁漢堡與酥脆薯條。',
        atmosphere: ['休閒', '快速'],
        menu: [
            { name: '雙層起司堡', price: 180, deliveryPrice: 225, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
            { name: '洋蔥圈', price: 60, deliveryPrice: 75, imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=400&q=80' },
        ],
        reviewAnalysis: {
            isIncentivized: false,
            positivePoints: ['份量大', '肉汁多', '上餐快'],
            negativePoints: ['環境吵雜', '薯條有時不脆'],
        },
        isOpen: true,
    },
    {
        id: '5',
        name: '玫瑰人生法式餐廳',
        type: '晚餐',
        cuisine: '法式',
        priceLevel: '$$$$',
        rating: 4.9,
        reviewCount: 150,
        user_ratings_total: 150,
        distance: 2500,
        mustTry: ['油封鴨腿', '法式焗蝸牛'],
        waitTime: 0,
        reservationInfo: '需提前預訂',
        reservationLink: 'https://inline.app/booking/roselife',
        advanceBookingDays: 14,
        deals: [],
        paymentMethods: ['信用卡'],
        deliveryPriceDiff: 0,
        imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3c6227685?auto=format&fit=crop&w=800&q=80',
        description: '適合特別日子的精緻餐飲體驗。',
        atmosphere: ['浪漫', '安靜', '優雅'],
        menu: [
            { name: '油封鴨腿', price: 880, deliveryPrice: 880, imageUrl: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&w=400&q=80' },
            { name: '法式焗蝸牛', price: 450, deliveryPrice: 450, imageUrl: 'https://images.unsplash.com/photo-1625938145744-e38051524294?auto=format&fit=crop&w=400&q=80' },
        ],
        reviewAnalysis: {
            isIncentivized: false,
            positivePoints: ['氣氛極佳', '服務專業', '餐點精緻'],
            negativePoints: ['價格昂貴', '份量少'],
        },
        isOpen: true,
    },
    {
        id: '6',
        name: '川味麻辣',
        type: '晚餐',
        cuisine: '中式',
        priceLevel: '$$$',
        rating: 4.4,
        reviewCount: 300,
        user_ratings_total: 300,
        distance: 1500,
        mustTry: ['麻婆豆腐', '宮保雞丁'],
        waitTime: 30,
        reservationInfo: '需提前預訂',
        reservationLink: 'https://inline.app/booking/sichuan',
        advanceBookingDays: 1,
        deals: ['4人以上9折'],
        paymentMethods: ['現金', 'LinePay'],
        deliveryPriceDiff: 15,
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
        description: '香辣過癮的道地川菜。',
        atmosphere: ['熱鬧', '適合家庭'],
        menu: [
            { name: '麻婆豆腐', price: 280, deliveryPrice: 320, imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80' },
            { name: '宮保雞丁', price: 320, deliveryPrice: 360, imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80' },
        ],
        reviewAnalysis: {
            isIncentivized: true,
            positivePoints: ['夠辣', '白飯好吃', '適合聚餐'],
            negativePoints: ['服務態度普通', '太辣'],
        },
        isOpen: true,
    },
    {
        id: '7',
        name: '喬的咖啡',
        type: '早餐',
        cuisine: '咖啡廳',
        priceLevel: '$',
        rating: 4.3,
        reviewCount: 80,
        user_ratings_total: 80,
        distance: 100,
        mustTry: ['冷萃咖啡', '貝果'],
        waitTime: 5,
        reservationInfo: '無需訂位',
        advanceBookingDays: 0,
        deals: [],
        paymentMethods: ['現金', 'ApplePay'],
        deliveryPriceDiff: 10,
        imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80',
        description: '快速補充咖啡因的好地方。',
        atmosphere: ['安靜', '適合工作'],
        menu: [
            { name: '冷萃咖啡', price: 100, deliveryPrice: 110, imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80' },
            { name: '貝果', price: 60, deliveryPrice: 70, imageUrl: 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&w=400&q=80' },
        ],
        reviewAnalysis: {
            isIncentivized: false,
            positivePoints: ['咖啡順口', '貝果有嚼勁', '安靜'],
            negativePoints: ['座位少', '沒有插座'],
        },
        isOpen: true,
    },
    {
        id: '8',
        name: '午夜塔可',
        type: '點心',
        cuisine: '墨西哥',
        priceLevel: '$',
        rating: 4.7,
        reviewCount: 220,
        user_ratings_total: 220,
        distance: 600,
        mustTry: ['牛肉塔可', '玉米片'],
        waitTime: 10,
        reservationInfo: '無需訂位',
        advanceBookingDays: 0,
        deals: ['週二塔可日：塔可$50'],
        paymentMethods: ['現金'],
        deliveryPriceDiff: 20,
        imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
        description: '最佳宵夜選擇。',
        atmosphere: ['休閒', '熱鬧'],
        menu: [
            { name: '牛肉塔可', price: 80, deliveryPrice: 100, imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=400&q=80' },
            { name: '玉米片', price: 120, deliveryPrice: 150, imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80' },
        ],
        reviewAnalysis: {
            isIncentivized: false,
            positivePoints: ['口味道地', '醬料特別', '開很晚'],
            negativePoints: ['只有戶外座位', '蚊子多'],
        },
        isOpen: true,
    },
];

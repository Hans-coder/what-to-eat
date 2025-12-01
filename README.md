# 🐱 MoodEat (橘貓食堂)

**MoodEat** 是一個 AI 驅動的美食推薦系統，由一隻貪吃又可愛的「橘貓」擔任你的專屬美食顧問！
它能聽懂你的心情、理解你的情境，並推薦最適合當下的餐廳。不再有「午餐吃什麼」的煩惱！

![MoodEat Screenshot](https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80) 
*(示意圖，實際介面請見 Walkthrough)*

## ✨ 核心功能

*   **🐱 橘貓 AI 顧問**：
    *   內建「橘貓人格」，語氣慵懶可愛，會用「喵」跟你聊天。
    *   分析你的心情（如：累了、慶祝、生氣），推薦對應的療癒食物。
*   **🎯 智慧推薦**：
    *   整合 **Google Gemini 2.0 Flash** 模型，精準理解語意。
    *   整合 **Google Places API**，提供真實餐廳資訊、評分、營業時間。
*   **🎲 幫我選一個 (One Pick)**：
    *   選擇困難症救星！一鍵隨機選出一間餐廳並高亮顯示。
*   **📍 手動/自動定位**：
    *   支援瀏覽器自動定位。
    *   支援手動搜尋地點（如：輸入「台北車站」）。
*   **⚡ 快速指令 (Quick Actions)**：
    *   預設常用情境按鈕（我好累、隨便吃、慶祝...），一鍵送出。

## 🛠️ 技術架構

*   **Frontend**: Next.js 16 (App Router), React, Tailwind CSS
*   **AI**: Google Generative AI SDK (`@google/generative-ai`)
*   **Maps**: Google Places API (`use-places-autocomplete`)
*   **Icons**: Lucide React

## 🚀 快速開始 (Getting Started)

### 1. 安裝依賴
```bash
npm install
```

### 2. 設定環境變數
請複製 `.env.example` (若無則直接建立 `.env.local`) 並填入以下 Key：

```bash
# .env.local
GEMINI_API_KEY=你的_Gemini_API_Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=你的_Google_Maps_API_Key
```

*   **Gemini API Key**: [取得連結](https://aistudio.google.com/app/apikey)
*   **Google Maps API Key**: [取得連結](https://console.cloud.google.com/) (需啟用 Places API)

### 3. 啟動開發伺服器
```bash
npm run dev
```
打開瀏覽器前往 [http://localhost:3000](http://localhost:3000) 即可開始使用！

## 📦 部署 (Deployment)

本專案推薦部署至 **Vercel**。

1.  **安裝 Vercel CLI**: `npm i -g vercel`
2.  **登入**: `vercel login`
3.  **部署**: `vercel --prod`
4.  **設定環境變數**: 部署後務必在 Vercel Dashboard 設定上述的 API Keys。

## 📝 專案結構

*   `app/page.tsx`: 主頁面邏輯 (Chat UI, State Management)。
*   `app/api/recommend/route.ts`: 後端 API，處理 Gemini 溝通與 Google Places 搜尋。
*   `components/LocationPicker.tsx`: 地點選擇器組件。
*   `lib/gemini.ts`: Gemini AI 設定與 Prompt 工程 (橘貓人格設定在此)。

---
*Made with ❤️ by MoodEat Team (and a hungry Orange Cat 🐱)*

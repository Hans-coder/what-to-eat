# 如何取得 Google Maps API Key

由於 Google Maps API 需要綁定 Google Cloud 帳單（雖然有每月 200 美金的免費額度，但仍需綁定信用卡以防濫用），因此**我無法幫您直接產生**。

請依照以下步驟自行取得 Key：

## 步驟 1：建立 Google Cloud 專案
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)。
2. 登入您的 Google 帳號。
3. 點擊左上角的專案選單，選擇 **「建立專案」 (New Project)**。
4. 輸入專案名稱（例如 `WhatToEatApp`），然後點擊 **「建立」**。

## 步驟 2：啟用 API 服務
1. 在左側選單中，點擊 **「API 和服務」 (APIs & Services)** > **「程式庫」 (Library)**。
2. 搜尋並啟用以下 **兩個** API（非常重要，缺一不可）：
   - **Places API (New)** 或 **Places API**：用於搜尋餐廳資料。
   - **Maps JavaScript API**：用於地圖顯示（雖然我們目前還沒用到地圖顯示，但建議先開著）。
3. 點擊 API 卡片，然後按 **「啟用」 (Enable)**。

## 步驟 3：取得 API Key
1. 回到 **「API 和服務」** > **「憑證」 (Credentials)**。
2. 點擊上方的 **「建立憑證」 (Create Credentials)** > **「API 金鑰」 (API Key)**。
3. 系統會產生一串以 `AIza` 開頭的亂碼，這就是您的 **API Key**。
4. **複製這串 Key**。

## 步驟 4：設定專案環境變數
1. 回到您的專案資料夾。
2. 找到或建立一個名為 `.env.local` 的檔案。
3. 貼上您的 Key：
   ```env
   GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. **重新啟動程式** (`npm run dev`)。

> [!WARNING]
> **關於費用**：Google Maps API 每月提供 200 美金的免費額度，對於開發測試和個人使用通常是完全免費的。但請務必在 Google Cloud Console 設定 **「預算通知」 (Budget Alerts)** 以避免意外產生費用。

# LaTeX 資源網 ── 完美的排版藝術與科學

一個專為學術研究人員、學生與 LaTeX 初學者設計的**高品質學習與語法速查平台**。本專案透過直觀的互動介面、免安裝的即時公式沙盒，以及由 KaTeX 驅動的語法速查工具，帶領使用者探索 LaTeX 的結構化排版美學。

## 🌟 核心特色與功能

1. **何謂 LaTeX (Introduction)**
   - 深入介紹 LaTeX「內容與格式完全分離」的所想即所得 (WYSIWYM) 哲學。
   - 透過直觀的切換字元，詳細對比微軟 MS Word（所見即所得，WYSIWYG）與 LaTeX 在長篇文檔和公式排版上的優劣勢。

2. **發展歷史 (History Timeline)**
   - 提供精美的互動式歷史時間軸，追溯自 1977 年 TeX 系統誕生至現代 LaTeX3 的演進足跡。
   - 記錄高德納 (Donald Knuth)、藍伯特 (Leslie Lamport) 等電腦科學大師的傳奇故事，並隨附饒富趣味的「LaTeX 趣味冷知識」。

3. **語法速查大全 (Cheat Sheet)**
   - 按單元分類收錄常用的 LaTeX 語法與數學符號。
   - 每個符號皆提供 **KaTeX 即時公式預覽**、**中文功能說明**以及**一鍵複製代碼**功能。
   - **已實作單元**：
     - `1. 二元運算號`（加減乘除、直和直積、聯集交集等 24 個標準運算號）。
     - `2. 二元關係符號`（大小關係、集合屬於、平行垂直等 39 個關係符號，並特別設計了「使用 `\not` 快速生成否定形式」的動態提示方塊）。
     - `3. 邏輯符號`（任意、存在、所以、因為、且、或、非等 15 個邏輯符號）。

4. **學習資源與工具 (Learning & Tools)**
   - 規劃「三步零基礎入門 LaTeX」導覽，指引初學者從註冊 Overleaf 線上協作開始，到掌握文檔導言區與正文結構。
   - 整理並提供本地端編譯包（TeX Live, MacTeX）及實用工具（如符號手寫辨識 Detexify）的官方下載與連結。

5. **即時公式沙盒 (Live Math Sandbox)**
   - 免安裝環境，直接在瀏覽器中輸入 LaTeX 原始碼，即可透過 KaTeX 引擎即時编译與預覽排版結果。
   - 提供常用學術公式範本（如薛丁格方程式、傅立葉變換等）一鍵套用，以及常用數學結構的快速插入工具列。

---

## 🛠️ 技術棧 (Tech Stack)

* **核心框架**：React (v19.2.7)
* **構建工具**：Vite (v8.1.0)
* **樣式系統**：Vanilla CSS
  - 專為現代顯示器設計的 **Cosmic Scientific 深色調視覺**。
  - 精細調整的頁首、頁尾、容器與字型大小，實現**首屏免滾動條**的緊湊式排版優化。
* **數學渲染**：KaTeX CDN (自適應行內與區塊渲染)
* **圖標庫**：Lucide React

---

## 📂 專案目錄結構

```text
LATEX/
├── src/
│   ├── components/
│   │   ├── CheatSheet.jsx       # 語法速查元件 (包含 KaTeX 渲染與一鍵複製)
│   │   ├── HistoryTimeline.jsx  # 歷史演進互動時間軸元件
│   │   └── MathSandbox.jsx      # 即時公式編輯器與快速插入元件
│   ├── data/
│   │   └── latexCommands.js     # LaTeX 語法資料庫 (以 JSON 格式分類儲存)
│   ├── assets/                  # 靜態資源
│   ├── App.jsx                  # 主程式入口與路由分發
│   ├── App.css                  # 元件輔助樣式
│   ├── index.css                # 核心設計系統與 Vanilla CSS 變數定義
│   └── main.jsx                 # React 渲染入口
├── index.html                   # HTML 入口 (導入 Google Fonts 與 KaTeX CDN)
├── package.json                 # 專案依賴與腳本配置
└── vite.config.js               # Vite 編譯設定
```

---

## 🚀 安裝與開發啟動

### 1. 複製本機專案並安裝依賴
在專案根目錄下執行：
```bash
npm install
```

### 2. 啟動本地開發伺服器
啟動具有熱重載 (HMR) 功能的 Vite 開發環境：
```bash
npm run dev
```
啟動後可在瀏覽器開啟顯示的本機網址（例如 `http://localhost:5173/LATEX/`）進行預覽與開發。

### 3. 生產環境編譯打包
將專案編譯壓縮為靜態檔案（將輸出至 `dist/` 目錄）：
```bash
npm run build
```

### 4. 專案部署 (GitHub Pages)
本專案已配置 `gh-pages`。在完成編譯後，可直接執行以下命令一鍵部署至 GitHub Pages：
```bash
npm run deploy
```
